import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { IPageVersion } from '@codigo/schema';

@Entity({ name: 'page_version' })
export class PageVersion implements IPageVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column()
  page_id: number = 0;

  @Column()
  account_id: number = 0;

  @Column()
  version: number = 1;

  @Column()
  desc: string = '';

  @Column({ type: 'simple-json' })
  schema_data: Record<string, any> = {};

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
