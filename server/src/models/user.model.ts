import { eBD_fields } from './../share/enums';
import mongoose from "mongoose";


// Interface for user document fields
export interface IUserFields {
  _id: mongoose.Types.ObjectId;
  userName: string;
  eMail: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for user document METHODS
export interface IUserDocument extends IUserFields, Document {
  _id: mongoose.Types.ObjectId; // Ensure _id type matches Document interface
}
// Interface for user MODEL methods
export interface IUserModel extends mongoose.Model<IUserDocument> {}


const userSchema = new mongoose.Schema<IUserDocument>(
  {
    userName: {
      type: String,
      require: true,
      unique: true,
      // check length before use
      maxlength: eBD_fields.userName_maxlength,
    },
    eMail: {
      type: String,
      require: true,
      unique: true,
      // check length before use
      maxlength: eBD_fields.eMail_maxlength,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
// const UserModel = mongoose.model("User", userSchema);
const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;