import { Injectable } from '@nestjs/common';
import { CompletedProgramDto } from './dto/student.dto';
import { UsersService } from 'src/users/users.service';
import { AuthExceptions } from 'src/common/helpers/exceptions';
import { ProblemService } from 'src/problem/problem.service';
import mongoose from 'mongoose';

@Injectable()
export class StudentService {
    constructor(
        private readonly usersService: UsersService,
        private readonly problemService: ProblemService,

    ) { }

    async markProblemAsCompleted(body: CompletedProgramDto, loginUserId: string) {
        // API to mark problem as completed
        const user = await this.usersService.findOne(loginUserId)
        if (!user) {
            throw AuthExceptions.AccountNotExist();
        }

        await this.problemService.findOne(body.programId)

        // Check if the problem is already completed
        if (!user.completedProblems.includes(new mongoose.Types.ObjectId(body.programId))) {
            user.completedProblems.push(new mongoose.Types.ObjectId(body.programId)); // Push problem ID to the array
            await user.save();
        }
        return {}
    }

}
