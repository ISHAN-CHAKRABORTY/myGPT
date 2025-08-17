import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import getgoogleAPIResponse from "../utils/myGPT.js";

const router= express.Router();

router.post("/test",async(req,res)=>{
    try {
        const thread=new Thread({
            threadId:"abc",
            title:"Testing another thread"
        });
    const response = await thread.save();
    res.send(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({error:"Failed to save in DB"});        
    }
})

router.get("/thread",async(req,res)=>{
    try {
     const threads = await Thread.find({}).sort({updatedAt:-1});
     res.json(threads);
    } catch (err) {
      console.log(err); 
      res.status(500).json({error:"Failed to fetch threads!"}); 
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId} =req.params;
    try {
        const thread= await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }

        res.json(thread.messages);
    } catch (err) {
     console.log(err); 
      res.status(500).json({error:"Failed to fetch chats"}); 
    }
})



router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} =req.params;
    try {
        const deletedThread= await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
           return res.status(404).json({error:"Thread not found"});
        }

        res.status(200).json({success:"Thread deleted successfully"});
    } catch (err) {
     console.log(err); 
      res.status(500).json({error:"Failed to delete chats"}); 
    }
})

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId }); // use let here

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }]
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getgoogleAPIResponse(message);
    console.log("Assistant Reply:", assistantReply);

    thread.messages.push({
      role: "assistant",
      content:
        assistantReply && assistantReply.trim() !== ""
          ? assistantReply
          : "Sorry, I couldn't generate a response."
    });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
});
 export default router;
// router.post("/chat",async(req,res)=>{
//     const{threadId,message}=req.body;

//     if(!threadId || !message){
//         return res.status(400).json({error:"Missing required fields"});
//     }
//     try {
//         const thread= await Thread.findOne({threadId});
//         if(!thread){
//             thread = new Thread({
//                 threadId,
//                 title:message,
//                 messages:[{role:"user",content:message}]
//             });
//         }
//         else{
//             thread.messages.push({role:"user",content:message});
//         }
//         const assistantReply= await getgoogleAPIResponse(message);
//         console.log("Assistant Reply:", assistantReply);

//         thread.messages.push({
//   role: "assistant",
//   content: assistantReply && assistantReply.trim() !== ""  ? assistantReply : "Sorry, I couldn't generate a response."
//         });

//         //thread.messages.push({role:"assistant",content:assistantReply});
//         thread.updatedAt=new Date();
//         await thread.save();
//         res.json({reply:assistantReply});
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({error:"something went wrong"});
//     }
// });
// export default router;