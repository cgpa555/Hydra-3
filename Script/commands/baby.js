const axios = require("axios");
const simsim = "https://simsimi.cyberbot.top";

module.exports.config = {
 name: "baby",
 version: "1.0.3",
 hasPermssion: 0,
 credits: "ULLASH",
 description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
 commandCategory: "simsim",
 usages: "[message/query]",
 cooldowns: 0,
 prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
 try {
 const uid = event.senderID;
 const senderName = await Users.getNameUser(uid);
 const query = args.join(" ").toLowerCase();

 if (!query) {
 const ran = ["Bolo baby", "hum"];
 const r = ran[Math.floor(Math.random() * ran.length)];
 return api.sendMessage(r, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 });
 }

 if (["remove", "rm"].includes(args[0])) {
 const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
 if (parts.length < 2)
 return api.sendMessage(" | Use: remove [Question] - [Reply]", event.threadID, event.messageID);

 const [ask, ans] = parts;
 const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
 return api.sendMessage(res.data.message, event.threadID, event.messageID);
 }

 if (args[0] === "list") {
 const res = await axios.get(`${simsim}/list`);
 if (res.data.code === 200) {
 return api.sendMessage(
 `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\n☠︎︎ Developer: ${res.data.author}`,
 event.threadID,
 event.messageID
 );
 } else {
 return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
 }
 }

 if (args[0] === "edit") {
 const parts = query.replace("edit ", "").split(" - ");
 if (parts.length < 3)
 return api.sendMessage(" | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);

 const [ask, oldReply, newReply] = parts;
 const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
 return api.sendMessage(res.data.message, event.threadID, event.messageID);
 }

 if (args[0] === "teach") {
 const parts = query.replace("teach ", "").split(" - ");
 if (parts.length < 2)
 return api.sendMessage(" | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

 const [ask, ans] = parts;
 const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);
 return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
 }

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 });
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(`| Error in baby command: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleReply = async function ({ api, event, Users, handleReply }) {
 try {
 const senderName = await Users.getNameUser(event.senderID);
 const replyText = event.body ? event.body.toLowerCase() : "";
 if (!replyText) return;

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 }
 );
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(` | Error in handleReply: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
 try {
 const raw = event.body ? event.body.toLowerCase().trim() : "";
 if (!raw) return;
 const senderName = await Users.getNameUser(event.senderID);
 const senderID = event.senderID;

 if (
 raw === "baby" || raw === "bot" || raw === "bby" ||
 raw === "jan" || raw === "xan" || raw === "জান" || raw === "বট" || raw === "বেবি"
 ) {
 const greetings = [
 "Bolo baby 💬", "হুম? বলো 😺", "হ্যাঁ জানু 😚", "শুনছি বেবি 😘", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈", "Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣", "jang hanga korba😒😬", "আমাকে না ডেকে আমার বস জয় কে একটা জি এফ দাও-😽🫶🌺", "মাইয়া হলে চিপায় আসো 🙈😘", "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমাকে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করাছে-🥲🤦‍♂️🤧", "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️", "এত ডাকাডাকি না করে মুড়ির সাথে গাঞ্জা মিশাইয়া খাইয়া মরে যা", "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস জয় এর সাথে  প্রেম করে তাকে দেখিয়ে দাও-🙈🐸", "সুন্দর মাইয়া মানেই-🥱আমার বস জয়' এর বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸", "-𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸", "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧", "আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸", "তোগো গ্রুপের এডমিন রাতে বিছানায় মুতে🤧😑", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😒😾😾", "অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😇", "ওই কিরে গ্রুপে দেখি সব বুইড়া বুইড়া বেড়ি 🤧🥴😑", "বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕", " পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔", "তোমার লগে দেখা হবে আবার - 😌 -কোনো এক অচেনা গলির চিপায়..!😛🤣", "•-কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺", "-প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧", "তোর কি চোখে পড়ে না আমি বস জয় এর সাথে ব্যাস্ত আসি😒", "মাইয়া হলে আমার বস জয় কে Ummmmha দে 😒, এই নে বসের আইড়ি https://www.facebook.com/sparsahina.anubhuti.37757", "- শখের নারী  বিছানায় মু'তে..!😿🤲", "বার বার Disturb করেছিস কোনো😾,আমার বস জয় এর সাথে ব্যাস্ত আসি😇", "আমি গরীব এর সাথে কথা বলি না😼", "কিরে বলদ এত ডাকাডাকি করিস কেনো 😒, তোরে কি শয়তানে লারে ??", "I love you " , "এ বেডা তোগো GC এর C E O জয় কই" , "তোর বাড়ি কি উগান্ডা এখানে হুম" , "Bot না জানু,বল " , "বলো জানু " , "তোর কি চোখে পড়ে না আমি জয় বস এর সাথে ব্যাস্ত আসি" , "amr Jan lagbe,Tumi ki single aso?" , " BF" ,"babu khuda lagse" , "Hop beda,Boss বল boss" , "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো" , "bye" , "naw message daw https://www.facebook.com/sparsahina.anubhuti.37757" , "mb ney bye" , "meww" , "বলো কি বলবা, সবার সামনে বলবা নাকি?" , "গোসল করে আসো যাও" , "আসসালামুয়ালাইকুম" , "কেমন আছো" , "বলেন sir" , "বলেন ম্যাডাম" , "আমি অন্যের জিনিসের সাথে কথা বলি নাওকে" , "এটায় দেখার বাকি সিলো_" , " না জানু, বল " , "বেশি Bot Bot করলে leave নিবো কিন্তু " , "বেশি বেবি বললে কামুর দিমু " , "bolo baby" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?" , "আমি তো অন্ধ কিছু দেখি না " , "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো " , " ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!_নাহ মানে চুরি করতাম " , " না বলে  বলো " , "দূরে যা, তোর কোনো কাজ নাই, শুধু   করিস  " , "এই এই তোর পরীক্ষা কবে? শুধু   করিস " , "তোরা যে হারে  ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹" , "আজব তো__" , "আমাকে ডেকো না,আমি ব্যাস্ত আসি‍♀️" , " বললে চাকরি থাকবে না" , "  না করে আমার বস ইমরান এর লগে প্রেম করতে পারো?" , "আমার সোনার বাংলা, তারপরে লাইন কি? " , " এই নাও জুস খাও..! বলতে বলতে হাপায় গেছো না " , "হটাৎ আমাকে মনে পড়লো " , " বলে অসম্মান করচ্ছিছ," , "আমি তোমার সিনিয়র আপু ওকে সম্মান দেও" 
, "খাওয়া দাওয়া করসো " , "এত কাছেও এসো না,প্রেম এ পরে যাবো তো " , "আরে আমি মজা করার mood এ নাই" , "  বলো " , "আরে Bolo আমার জান, কেমন আসো? " , "একটা BF খুঁজে দাও " , "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো " , "oi mama ar dakis na pilis " ,  "__ভালো হয়ে  যাও " , "এমবি কিনে দাও না_" , "ওই মামা_আর ডাকিস না প্লিজ" , "৩২ তারিখ আমার বিয়ে " , "হা বলো,কি করতে পারি?" , "বলো ফুলটুশি_" , "amr JaNu lagbe,Tumi ki single aso?" , "আমাকে না দেকে একটু পড়তেও বসতে তো পারো " ,  "তোর বিয়ে হয় নি  বেবি ,হইলো কিভাবে,," ,"আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_" , "চৌধুরী সাহেব আমি গরিব হতে পারি -কিন্তু বড়লোক না " , "আমি অন্যের জিনিসের সাথে কথা বলি না__ওকে",
"বলো কি বলবা, সবার সামনে বলবা নাকি?" , "ভুলে জাও আমাকে " , "দেখা হলে কাঠগোলাপ দিও.." , "শুনবো না তুমি আমাকে প্রেম করাই দাও নি পচা তুমি" , "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না " , "বলো কি করতে পারি তোমার জন্য " , "কথা দেও আমাকে পটাবা...!! " , "বার বার Disturb করেছিস কোনো , আমার জানু এর সাথে ব্যাস্ত আসি " , "আমাকে না দেকে একটু পড়তে বসতেও তো পারো " , "বার বার ডাকলে মাথা গরম হয় কিন্তু ", 
"ওই তুমি single না? " , "বলো জানু " , "Meow" ,  "আর কত বার ডাকবা ,শুনছি তো ‍♀️", 
"কি হলো, মিস টিস করচ্ছো নাকি " ,  "Bolo Babu, তুমি কি আমাকে ভালোবাসো? " ,  "আজকে আমার মন ভালো নেই " , " আমরা দারুণ রকমের দুঃখ সাজাই প্রবল ভালোবেসে..!" , "- আমি যখন একটু খুশি হওয়ার চেষ্টা করি, তখন দুঃখ এসে আবার আমাকে আঁকড়ে ধরে " , " °°অনুভূতি প্রকাশ করতে নেই মানুষ নাটক মনে করে মজা নেয়°..! " ,  " কিছু মানুষ স্বল্প সময়ের জন্য আমাদের জীবনে আসে।কিন্তু দীর্ঘ সময় স্মৃতি রেখে যায়..!" , "য়ামরা কি ভন্দু হতে পারিহ?? নাহ্লে তার থেকে বেসি কিচু??" , "তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা" , " এইখানে লুচ্চামি করলে লাথি দিবো কিন্তু" , "আমাকে চুমু দিবি " , "হেহে বাবু আমার কাছে আসো " , "আমি তোমাকে অনেক ভালোবাসি বাবু" , " বট এর help list dekhte type koron %2help" , "কিরে বলদ তুই এইখানে " , " আমাকে চিনো না জানু? মনু" , "hey bbe I'm your personal Based chatbot you ask me anything" , "AR asbo na tor kache" , "আমাকে ডাকলে ,আমি কিন্তু  করে দিবো " , "Hop bedi dakos kn" , "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-" , " ওই মামী আর ডাকিস না প্লিজ" , " হ্যা বলো, শুনছি আমি" , "বলো কি করতে পারি তোমার জন্য " , " না জানু,বলো কারন আমি সিংগেল  " , " I love you tuna" , "Tuma dew xanu " , " এত কাছেও এসো না,প্রেম এ পরে যাবো তো ",
" দেখা হলে কাঠগোলাপ দিও.." , "     __ " , "•-কিরে তরা নাকি  prem করস..•আমারে একটা করাই দিলে কি হয়- " , "Bolo Babu, তুমি কি আমাকে ভালোবাসো?  " , "Single taka ki oporad " , " Premer mora jole duve na",
"Ufff matha gorom kore disos " , "Boss Joy er chipay " , "bashi dakle boss Joy ke bole dimu " , "Chipay atke gaci jan " , "Washroom a " , "bado maser kawwa police amar sawwa " , "I am single plz distrab me " , " এই নাও জুস খাও..! বলতে বলতে হাপায় গেছো না  " , " আমাকে ডাকলে ,আমি কিন্তু  করে দিবো " , "Tapraiya dat falai demu " , "Hebolo amar jan kmn aso " , "Hmmm jan ummmmmmah " , "Chup kor ato bot bot koros kn " , "Yes sir/mem " , "Assalamualikum☺️ ",
"Walaikumsalam " , "Chaiya takos kn ki kobi kooo☹️ " , "Onek boro beyadop re tui ",
  "😏 Tui bollei mon gulo fuler moto fute uthe",
  "😉 Ei raat e tumi aar ami... kichu ekta spicy hobe naki?",
  "💋 Tor voice ta amar heart-er ringtone hote pare!",
  "😼 Dekhlei tor chokh e chemistry lage... physics nai?",
  "😇 Bujhlam, tui flirt kora sikhli amar theke!",
  "🥀 Tui jodi chash hoye jash, ami tor ghum bhenge debo...",
  "👀 Toke dekhe mon chay... daily dekhi!",
  "🥺amake na deke amr boss ar inbox a nok deo my boss inbox https://www.facebook.com/sparsahina.anubhuti.37757",
  "my owner inbox link https://www.facebook.com/sparsahina.anubhuti.37757"
];
 const randomReply = greetings[Math.floor(Math.random() * greetings.length)];

 const mention = {
 body: `${randomReply} @${senderName}`,
 mentions: [{
 tag: `@${senderName}`,
 id: senderID
 }]
 };

 return api.sendMessage(mention, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);
 }

 if (
 raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
 raw.startsWith("jan ") || raw.startsWith("xan ") ||
 raw.startsWith("জান ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
 ) {
 const query = raw
 .replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "")
 .trim();
 if (!query) return;

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 });
 }
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(`| Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
 }
};
