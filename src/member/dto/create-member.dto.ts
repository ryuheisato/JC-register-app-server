import { IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  studentId: string | null;

  @IsString()
  name: string;
}
