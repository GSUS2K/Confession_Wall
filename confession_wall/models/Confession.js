import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const confessionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    secretCode: {
        type: String,
        required: true
    },
    reactions: {
        like: {type: Number, default: 0},
        love: {type: Number, default: 0},
        laugh: {type: Number, default: 0},
        cry: {type: Number, default: 0}
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

confessionSchema.pre('save', async function() {
    if(!this.isModified('secretCode')) return ;
    const salt = await bcrypt.genSalt(10);
    this.secretCode = await bcrypt.hash(this.secretCode, salt)
    // next()
})

confessionSchema.methods.verifyCode = async function(plainCode){
    return bcrypt.compare(plainCode, this.secretCode)
}

export default mongoose.models.Confession || mongoose.model('Confession', confessionSchema)
