import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class ConnectionsService {
    constructor(private prisma: PrismaService, private util: UtilitiesService) { }

    // user send connect request 
    async connectUsers(sendingUserId: number, receivingUserId: number) {
        try {
            const sendingUser = await this.prisma.user.findUnique({ where: { id: sendingUserId, } })
            const receivingUser = await this.prisma.user.findUnique({ where: { id: receivingUserId } })
            let receiverlocation = JSON.stringify(receivingUser.location)
            receiverlocation = JSON.parse(receiverlocation)
            let senderlocation = JSON.stringify(sendingUser.location)
            senderlocation = JSON.parse(senderlocation)

            // calculate distance 
            const distance = this.caluculateDistance(senderlocation['lat'], senderlocation['long'], receiverlocation['lat'], receiverlocation['long'])
            if (distance > 50) {
                return new HttpException("You exceeded the distance", HttpStatus.FORBIDDEN)
            }
            // check if user is already connected
            const connectedUser = await this.prisma.connection.findFirst({
                where: {
                    sendingUserId: +sendingUser.id,
                    receivingUserId: +receivingUser.id
                }
            })
            if (connectedUser) return this.util.dataReponseObject('Already sent a connection Request', 200)

            await this.prisma.connection.create({
                data: {
                    sendingUserId: +sendingUser.id,
                    receivingUserId: +receivingUser.id
                }
            })

            return this.util.dataReponseObject("Connection request sent", 200)

        } catch (error) {
            throw new Error(error.message)
        }
    }

    // userViewAll his/her connections 
    async viewAllConnections(userId: number) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                }
            })
            const connections = this.prisma.connection.findMany({
                where: {
                    status: true,
                    OR: [
                        { sendingUserId: user.id },
                        { receivingUserId: user.id },
                        { status: true }
                    ]
                },
                include: {
                    sendingUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                            username: true,
                            photoUrl: true,
                            activities: true,
                            bio: true,
                            events: true,
                        }
                    }
                }
            });

            (await connections).forEach(conn => delete conn.receivingUserId)

            return connections;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllPendingreceivedConnections(userId: number) {
        try {
            const receivedConnections = await this.prisma.connection.findMany({
                where: {
                    status: false,
                    receivingUserId: userId,
                },
                include: {
                    sendingUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                            activities: true,
                            photoUrl: true
                        }
                    },

                }
            })
            return receivedConnections;

        } catch (error) {
            throw new Error(error);
        }

    }

    // user accept to connect request  
    async userAcceptConnectRequest(receiverid: number, connectSentId: number) {
        try {
            const accpetedConnection = await this.prisma.connection.update({
                data: {
                    status: true,
                },
                where: {
                    receivingUserId: receiverid,
                    id: connectSentId
                },
                include: {
                    sendingUser: {
                        select: {
                            firstName: true
                        }
                    }
                }
            })
            return this.util.dataReponseObject(`You are now connected with ${accpetedConnection.sendingUser.firstName}`, 200)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // user revoke/terminate connection 
    async revokeConnection(connectionId: number, userId: number) {
        try {
            const connection = await this.prisma.connection.delete({
                where: {
                    id: connectionId,
                    receivingUserId: userId
                }
            })
            return this.util.dataReponseObject("You have revoked the connection", 200);
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // get connection Profile 
    async connectionProfile(userId: number) {
        try {
            let connectionProfile = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

            const { phonenumber, email, is_email_verified,
                is_phone_number_verified, password, bannerId,
                isConfigured, geohashLocation, above_18,
                accept_terms, createdAt, updatedAt, role, gender, ...connectionTrimmed } = connectionProfile;

            return connectionTrimmed;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    // return suggested connections basing on Distance and Activities 
    async SuggestedConnectionBasedDistanceAndActivites(userId: number) {
        try {
            const getUser = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
                include: {
                    activities: {
                        select: {
                            id: true,
                            activity_id: true,
                            activity_name: true
                        }
                    }
                },

            })
            const getAllUsers = await this.prisma.user.findMany({
                where: {
                    NOT: {
                        id: getUser.id
                    }
                },
                include: {
                    activities: {
                        select: {
                            id: true,
                            activity_id: true,
                            activity_name: true
                        }
                    }
                }
            })
            const matchingActivitiesCounts = new Map<number, number>();
            getAllUsers.forEach((gottenUser) => gottenUser.activities.forEach((activity) => {
                const activityId = activity.activity_id
                const distance = this.caluculateDistance(getUser.location['lat'], getUser.location['long'], gottenUser.location['lat'], gottenUser.location['long'])
                if(distance <= 15){
                    
                const count = getUser.activities.filter((activity) => activity.activity_id === activityId).length
                if (count > 0) {
                    matchingActivitiesCounts.set(gottenUser.id, (matchingActivitiesCounts.get(gottenUser.id) || 0) + 1)
                }
                }
            
                
            }))
            const sortedIds = Array.from(matchingActivitiesCounts.entries()).sort((a, b) => b[1] - a[1]).map(entry => entry[0])
            console.log(matchingActivitiesCounts)
            console.log(sortedIds)
            const suggestedConnections = await Promise.all(sortedIds.map(userId => this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    photoUrl: true
                }
            })))
            return suggestedConnections
        } catch (error) {
            return new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }





    // algorithm to calculate the distance between user 
    caluculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const earthRadius = 6371; // Earth's radius in kilometers

        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return distance;
    }
    toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
