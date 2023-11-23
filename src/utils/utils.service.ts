import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { responseDto } from './dto/response.dto';
import errorsCode from './utils.errorsCode';


@Injectable()
export class UtilsService {
    constructor(){}

    handleError(error: responseDto) {
        // create code using object with all errors
        const messageCode = errorsCode[error.code];
        // handle error to create an exception
        throw new HttpException(
          {
            success: false,
            message: messageCode || error.message
          },
          HttpStatus.BAD_REQUEST,
        );
      }
}
