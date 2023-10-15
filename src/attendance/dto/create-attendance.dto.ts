import {
  IsString,
  IsOptional,
  Validate,
  ValidationArguments,
} from 'class-validator';

class EitherStudentIdOrName {
  validate(_, args: ValidationArguments) {
    const { object } = args;
    return !!(object['studentId'] || object['name']);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either studentId or name must be provided.';
  }
}

export class CreateAttendanceDto {
  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @Validate(EitherStudentIdOrName)
  eitherField: string; // This is a virtual field and will not be used directly.
}
