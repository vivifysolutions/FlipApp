import { IsInt, MaxLength } from "class-validator";

export class CodeDto {

    @MaxLength(4, {
        message: "Code mut not exceed 4 digits."
    })
    @IsInt()
    code: number

}