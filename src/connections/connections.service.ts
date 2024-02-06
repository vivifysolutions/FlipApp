import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class ConnectionsService {
    constructor(private prisma: PrismaService, private util: UtilitiesService) { }

    // user send connect request 
    async connectUsers(sendingUserId: number, receivingUserId: number) {
           try {
            const sendingUser = await this.prisma.user.findUnique({where: {id: sendingUserId,}})
            const receivingUser = await this.prisma.user.findUnique({where: {id: receivingUserId}})
            let receiverlocation = JSON.stringify(receivingUser.location)
            receiverlocation = JSON.parse(receiverlocation)
            let senderlocation = JSON.stringify(sendingUser.location)
            senderlocation = JSON.parse(senderlocation)

            // calculate distance 
            const distance = this.caluculateDistance(senderlocation['lat'], senderlocation['long'], receiverlocation['lat'], receiverlocation['long'])
            if(distance > 50){
                return new HttpException("You exceeded the distance", HttpStatus.FORBIDDEN)
            }
            // check if user is already connected
            const connectedUser = await this.prisma.connection.findFirst({
                where:{
                    sendingUserId:+sendingUser.id,
                    receivingUserId:+receivingUser.id
                }
            })
            if(connectedUser) return this.util.dataReponseObject('Already sent a connection Request', 200)

            await this.prisma.connection.create({
                data:{
                    sendingUserId:+sendingUser.id,
                    receivingUserId:+receivingUser.id
                }
            })

            return this.util.dataReponseObject("Connection request sent", 200)
            
           } catch (error) {
                throw new Error(error.message)
           }
    }

    getAllPendingConnections(userId:number){

    }

    // user accept to connect request  
    userAcceptConnectRequest() { }
    // user view all the connections 
    userViewAllConnections() { }

    // user revoke/terminate connection 
    userTerminateConnection() { }

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
