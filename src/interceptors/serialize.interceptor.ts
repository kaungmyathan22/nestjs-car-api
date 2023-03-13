import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

export class SerializerInterceptor implements NestInterceptor {
    constructor(private dto: any) { }
    intercept (context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }

}

export function Serialize (dto: any) {
    return UseInterceptors(new SerializerInterceptor(dto))
}