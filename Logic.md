IMPLEMENTATION - BASIC A

BACKEND 
Register - using passport [email & password]
Login - [email & password]
Protect urls ['add question', 'browse']

User create question
    * private quiz - Publish
    * public quiz - Waiting List For Approval
User delete question (OWNER)
User update question (OWNER)
View all questions (OWNER)
User change public/private (OWNER)

Admin 
    * Create, Update, Delete Any Question
    * Publish/Approve a question
    * Reject question - Send email with reason for rejection
    * Block / Unblock User from posting question
    * Increase number of questions a user can post

REFACTOR
    * Move functions to controllers
    * limiter number of questions
    * Give super admin authority to do more stuff

IMPLEMENTATION - BASIC B

BACKEND 
Email verification
Reset password 
Add Extra Attribute For User 
    e.g. Username etc

