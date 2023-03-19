import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) { }

  create (createReportDto: CreateReportDto, user: User) {
    try {
      const report = this.reportRepository.create(createReportDto);
      report.user = user;
      return this.reportRepository.save(report);
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong");
    }
  }

  findAll () {
    return `This action returns all reports`;
  }

  findOne (id: number) {
    return `This action returns a #${id} report`;
  }

  update (id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove (id: number) {
    return `This action removes a #${id} report`;
  }
}
