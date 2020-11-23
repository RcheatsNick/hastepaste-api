import {
    Entity,
    ObjectIdColumn,
    ObjectID,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "PasteEntity" })
export class PasteEntity {
    @ObjectIdColumn()
    public _id: ObjectID;

    @Column({ nullable: false, unique: true })
    public id: string;

    @Column()
    public owner_id?: string;

    @Column({ nullable: false })
    public content: string;

    @Column({ nullable: false })
    public title: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt: number;

    @UpdateDateColumn({ type: "timestamp" })
    public updateAt: number;

    constructor(partial: Partial<PasteEntity>) {
        Object.assign(this, partial);
    }
}
