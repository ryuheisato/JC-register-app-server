import { IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  studentId: string;

  @IsString()
  name: string;
}
