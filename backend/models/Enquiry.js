import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    service: { type: String, default: '' },
    timeline: { type: String, default: '' },
    budget: { type: String, default: '' },
    message: { type: String, default: '' },
    attachmentName: { type: String, default: null },
    attachmentUrl: { type: String, default: null },
    attachmentPublicId: { type: String, default: null },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'in_review', 'reviewed', 'contacted', 'in-progress', 'in_discussion', 'completed', 'closed', 'accepted', 'declined'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
