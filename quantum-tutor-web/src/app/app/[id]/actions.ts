'use server';
import connectDB from '@/lib/db';
import ChatSessionModel from '@/lib/models/ChatSession';
import Message from '@/lib/models/Message';
import Module from '@/lib/models/Module';

export async function GetChatSession(Chatid: string) {
	try{
		await connectDB();
		const chatHistory = await ChatSessionModel.findOne({ chatId: Chatid }, {_id: 0});
		let moduleMessages: any[] = [];
		
		if(chatHistory){
			const allMessages = chatHistory.messages?.map((msg: string) =>
        Message.findOne({"msgId": msg},{_id: 0}).lean()
      );
			const messages = await Promise.all(allMessages);

			if (messages?.length) moduleMessages.push(...messages);
			
			const allModules = chatHistory.modules?.map((module: string) =>
        Module.findOne({ moduleId: module }, { _id: 0 }).lean()
      );
			const modules = await Promise.all(allModules);
			// messages
			
			let messagesListForModules = modules.map((mod)=> mod?.messages);
			messagesListForModules = [].concat(...messagesListForModules);

			
			const allModulesMessages = messagesListForModules?.map((messageId: string) =>
        Message.findOne({"msgId": messageId},{_id: 0}).lean()
      );

      const allModuleMessages = await Promise.all(allModulesMessages);

			
			if (allModuleMessages?.length) moduleMessages.push(...allModuleMessages);
		}
		
		return moduleMessages;
	}
	catch(err){
		console.error(err);
		return;
	}
}
