import {
    Entity,
    ObjectIdColumn,
    ObjectID,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "UserEntity" })
export class UserEntity {
    @ObjectIdColumn()
    public _id: ObjectID;

    @Column({ nullable: false, unique: true })
    public id: string;

    @Column({ nullable: false, unique: true })
    public mail: string;

    @Column()
    public mail_verified: boolean;

    @Column({ nullable: false, default: false })
    public is_admin: boolean;

    @Column()
    public is_banned: boolean;

    @Column({ nullable: false })
    public password: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt: number;

    @UpdateDateColumn({ type: "timestamp" })
    public updateAt: number;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
