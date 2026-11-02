/* =====================================================================
   7 Psalms for Love — CONTEÚDO (todo o texto do app fica aqui)
   Tokens: {HER} = nome dela, {HIS} = nome dele, {HIS_S} = "Michael's"
   Escritura: KJV exata (conferida com bible-api.com, translation=kjv).
   ===================================================================== */

window.CONFIG = {
  brand: "7 Psalms for Love",
  narrator: "Marsha",
  supportEmail: "americansystem.support@gmail.com", // mesmo suporte do e-mail de entrega (IPN)
  refundDays: 90,                               // dias de garantia (Digistore24)
  refundUrl: "https://www.digistore24.com/",    // TROCAR: link de suporte de pedidos da Digistore24
  company: "",                                  // vazio = não mostra (preencher se quiser)
  address: "",                                  // vazio = não mostra
  unlockHour: 18,                               // noites abrem às 6 pm (horário dela)
  minHoursBetween: 12,                          // mínimo de horas depois da noite anterior
  nightModeFrom: 20, nightModeTo: 6,            // modo noturno automático (20h–6h)
  defaultPrayerTime: "22:00",
  upsells: [
    { id: "21days",  title: "21 Days After the Reunion", sub: "A couple's devotional for the first three weeks back together.", url: "#" },
    { id: "express", title: "Express Prayer Night",      sub: "One extra night of prayer for when the silence feels too long.", url: "#" }
  ],
  owned: []                                     // ids de upsell já comprados (ex.: ["21days"])
};

window.LOCKS = [
  { key: "anger",      name: "Anger",             night: 1, short: "the fight you never talked through",
    explain: `Old arguments are still loud in him. He may replay what was said and use anger to avoid feeling the loss.` },
  { key: "pride",      name: "Pride",             night: 2, short: "\"I can't go back now\"",
    explain: `He may be telling himself, and others, that he's fine. Going back can feel like losing face to him.` },
  { key: "longing",    name: "Swallowed Longing", night: 3, short: "he misses you and won't admit it",
    explain: `There may be more feeling in him than he shows. He keeps busy so he doesn't have to sit with it.` },
  { key: "forgetting", name: "Forgetting",        night: 4, short: "he decided to forget you",
    explain: `He may be trying to close the chapter by cutting off reminders: photos, places, people.` },
  { key: "shame",      name: "Shame",             night: 5, short: "\"she'll never forgive me\"",
    explain: `He may know he hurt you and not know how to face you. Distance can be his way of hiding.` },
  { key: "between",    name: "The One In Between", night: 6, short: "the other woman, family, friends",
    explain: `Someone else may have a strong voice in his decisions right now: a new person, family or friends.` },
  { key: "door",       name: "The Door",          night: 7, short: "coming back",
    explain: `The way back feels far to him right now. This is the lock everything else leads to.` }
];

/* contact: id do roteiro em "When He Reaches Out" (aparece o cartão no diário) */
window.NIGHTS = [
  {
    n: 0, lock: "Clean Heart", lockSub: "your own heart",
    ref: "Psalm 51:10–12",
    psalm: [
      [10, "Create in me a clean heart, O God; and renew a right spirit within me."],
      [11, "Cast me not away from thy presence; and take not thy holy spirit from me."],
      [12, "Restore unto me the joy of thy salvation; and uphold me with thy free spirit."]
    ],
    word: `Before we pray for him, we pray for you. That's how my mother did it, and that's how we'll do it.

A heart full of hurt can still pray. But it prays tired. Tonight we set the hurt down. Not because what happened didn't matter. It mattered. But you can't carry it into seven nights of prayer and still have room to receive.

Psalm 51 is the prayer of someone who needed a fresh start. "Create in me a clean heart." That's all we're asking tonight. You don't have to forgive everything by morning. You only have to open your hands.

One more thing before we begin. We never ask God to force anyone. We ask Him to soften, to heal, and to open what pride and pain have shut.`,
    prayer: `Lord, here I am. It's {HER}, and I'm tired. You know everything that happened between {HIS} and me. The words that hurt. The nights I cried. The things I wish I had done differently.

Tonight I lay all of it at Your feet. Create in me a clean heart, O God. Take the bitterness I've been holding, even the parts I didn't want to admit. Where I was wronged, help me let go of the need to win. Where I was wrong, give me the courage to own it.

I don't want to pray for {HIS} with anger in my mouth. I want to pray with a heart You have washed. Restore unto me the joy of Thy salvation. Let me sleep tonight in Your peace, not in my worry.

As I begin these seven nights, I place {HIS} in Your hands, not mine. Your will be done, in his heart and in mine. In Jesus' name, amen.`,
    signs: [
      { t: "More peace when I lie down" },
      { t: "I slept better" },
      { t: "Less urge to check his profile" },
      { t: "More patience with myself" }
    ],
    action: `Write what hurt you on a piece of paper. Pray over it. Then tear it up and throw it away.`,
    journal: `What did you write on the paper tonight? How did it feel to tear it up?`,
    audio: ""   // caminho do MP3 genérico (ex.: "audio/night-0.mp3")
  },
  {
    n: 1, lock: "Anger", lockSub: "the fight you never talked through",
    ref: "Psalm 4:4–8",
    psalm: [
      [4, "Stand in awe, and sin not: commune with your own heart upon your bed, and be still. Selah."],
      [5, "Offer the sacrifices of righteousness, and put your trust in the LORD."],
      [6, "There be many that say, Who will shew us any good? LORD, lift thou up the light of thy countenance upon us."],
      [7, "Thou hast put gladness in my heart, more than in the time that their corn and their wine increased."],
      [8, "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety."]
    ],
    word: `Every fight you two had left something behind. A word that stung. A door slammed. A silence that went on too long. Each one became a bar on the door between you.

Anger is often the first lock a man closes, because it feels safer than sadness.

Tonight we pray Psalm 4. It says, "commune with your own heart upon your bed, and be still." That's exactly where you are right now. In bed. Still.

We aren't asking God to make him wrong and you right. We're asking Him to quiet the anger, so both of you can hear again. And tonight you do your part too: no messages to him. Let the quiet do its work.`,
    prayer: `Lord, tonight I lift up {HIS} to You. You know the anger that grew between us. You heard every hard word, his and mine.

Go where I can't go, Lord. Go into {HIS_S} heart, into the places where he's still holding on to the fight. Quiet the anger there. Let the old arguments lose their grip on him. When he replays what I said, let him also remember what we had. Where hurt turned into anger, turn it gently back into honesty.

And do the same in me, in {HER}. I don't want to win anymore. I want peace. Lift up the light of Your countenance upon us both.

Help {HIS} lie down tonight in peace, and help me do the same. I won't reach for my phone. I'll reach for You. Only You make us dwell in safety. In Jesus' name, amen.`,
    signs: [
      { t: "Fewer cold or short replies" },
      { t: "He viewed my stories" },
      { t: "A calmer tone about practical things" },
      { t: "I feel less angry when I think of him" }
    ],
    action: `Send him no message today. If you feel the urge, pray tonight's psalm again instead.`,
    journal: `What's one fight you're ready to stop replaying?`,
    audio: ""
  },
  {
    n: 2, lock: "Pride", lockSub: "\"I can't go back now\"",
    ref: "Psalm 131:1–2",
    psalm: [
      [1, "LORD, my heart is not haughty, nor mine eyes lofty: neither do I exercise myself in great matters, or in things too high for me."],
      [2, "Surely I have behaved and quieted myself, as a child that is weaned of his mother: my soul is even as a weaned child."]
    ],
    word: `Pride is a funny lock. It makes a man say things his heart doesn't mean. "I'm fine." "I don't care." "It's better this way." Very often, that's pride talking.

Psalm 131 is one of the shortest psalms in the Bible. "LORD, my heart is not haughty." It's the prayer of someone who chose to be quiet and humble, like a child resting in his mother's arms.

Tonight we ask God to calm the pride in {HIS_S} heart. And we ask for the same in ours, because pride is rarely on one side only.

Your part today is simple. Post nothing that's meant for him to see. No sad quotes. No "living my best life." Let God speak to him without any noise from us.`,
    prayer: `Lord, You see {HIS} better than anyone. You know the pride that keeps him from saying what he feels. Tonight I ask You to soften it. Not to break him, Lord. To free him.

If in his heart he cares, let him stop pretending he doesn't. Quiet the voice that tells him he can't go back, that it would make him look weak. Teach him that humility is strength.

And search me too, Lord. Search {HER}. Where I've been proud, where I needed to be right, where I said "I don't need him" when it wasn't true, humble me gently. Let my soul be quiet like a weaned child, resting, not demanding.

I give You my need to control how this ends. I trust You with {HIS}, and I trust You with me. Let Your peace stand between us where pride used to stand. In Jesus' name, amen.`,
    signs: [
      { t: "His tone felt softer" },
      { t: "A mutual friend mentioned him" },
      { t: "He stopped posting things aimed at me" },
      { t: "I felt less need to prove something" }
    ],
    action: `Post nothing aimed at him today. Not a quote, not a photo, not a song.`,
    journal: `Where did you notice pride today, in him or in you?`,
    audio: ""
  },
  {
    n: 3, lock: "Swallowed Longing", lockSub: "he misses you and won't admit it",
    ref: "Psalm 42:1–2, 8",
    psalm: [
      [1, "As the hart panteth after the water brooks, so panteth my soul after thee, O God."],
      [2, "My soul thirsteth for God, for the living God: when shall I come and appear before God?"],
      [8, "Yet the LORD will command his lovingkindness in the daytime, and in the night his song shall be with me, and my prayer unto the God of my life."]
    ],
    word: `Many men miss someone and swallow it. They stay busy. They go out more. They act like nothing happened. But at night, when the house is quiet, the missing comes back.

Psalm 42 begins with a deer panting for water. That's what longing feels like. Thirst.

Tonight we pray that whatever {HIS} feels and keeps inside is no longer pushed down. If there's love there, we ask that he stops hiding it from himself. "In the night his song shall be with me." Night is when hearts are most honest.

Your part today is to do one thing just for you. A walk. A long bath. Lunch with a friend. You deserve care while you wait.`,
    prayer: `Lord, tonight I bring {HIS} before You. If he misses me and won't say it, You already know. Nothing is hidden from You.

Reach the longing he keeps swallowed. Let him stop pretending, first to himself. When the house is quiet and he lies down tonight, let Your song be with him in the night. Let good memories come back to him. The laughter. The ordinary days. The way we used to be. Not to hurt him, Lord, but to soften him.

And for me, {HER}, give me patience. My soul thirsts too. Teach me to bring that thirst to You first, so I don't pour it on him in a desperate message.

Command Your lovingkindness in the daytime, and be my song tonight. Whatever {HIS} feels, let it be honest, and let it lead him toward what is right. In Jesus' name, amen.`,
    signs: [
      { t: "He liked an old photo", contact: "liked-photo" },
      { t: "A \"hey, how are you?\" out of nowhere", contact: "hey" },
      { t: "He asked about my mom or my family", contact: "family" },
      { t: "A friend said he seems down" }
    ],
    action: `Do one thing just for you today. A walk, a long bath, a call with a friend.`,
    journal: `What memory with him came back to you today?`,
    audio: ""
  },
  {
    n: 4, lock: "Forgetting", lockSub: "he decided to forget you",
    ref: "Psalm 77:6, 11",
    psalm: [
      [6, "I call to remembrance my song in the night: I commune with mine own heart: and my spirit made diligent search."],
      [11, "I will remember the works of the LORD: surely I will remember thy wonders of old."]
    ],
    word: `Sometimes a man decides to forget. He deletes photos. He changes his routine. He tells himself it's over and tries to make it true by not thinking about it.

But love that was real doesn't disappear because someone stops looking at it.

Psalm 77 is a song in the night. "I call to remembrance my song in the night." It's about choosing to remember what God has done.

Tonight we ask that what was good and true between you is not erased from {HIS_S} heart. And your part today is about you. Write three things you love about who you are. Not about him. About you. Remembering starts at home.`,
    prayer: `Lord, tonight I lift up {HIS}. If he's trying to forget, You know why. Maybe it hurts too much to remember. Maybe it felt easier to close the door.

Gently, Lord, keep alive what was good between us. Let the true memories stay. The kindness. The promises made in love. The moments only we shared. In the night, when he communes with his own heart, let him remember honestly. Not only the fights. The love too.

And help me remember who I am. I'm {HER}, and I'm Yours. I am not only someone he left. Remind me of the gifts You put in me.

I will remember Your works, Lord. I will remember Your wonders of old. You have carried me before, and You are carrying me now. Hold {HIS} in Your memory too, and lead him where You want him to be. In Jesus' name, amen.`,
    signs: [
      { t: "He mentioned me, or I heard he dreamed about me" },
      { t: "He asked about my family", contact: "family" },
      { t: "He brought up an old memory or inside joke", contact: "hey" },
      { t: "He reacted to something I posted", contact: "liked-photo" }
    ],
    action: `Write three things you love about who you are. Keep the list inside your Bible.`,
    journal: `Which of your three things surprised you the most?`,
    audio: ""
  },
  {
    n: 5, lock: "Shame", lockSub: "\"she'll never forgive me\"",
    ref: "Psalm 34:4–5, 18",
    psalm: [
      [4, "I sought the LORD, and he heard me, and delivered me from all my fears."],
      [5, "They looked unto him, and were lightened: and their faces were not ashamed."],
      [18, "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit."]
    ],
    word: `Shame is often the last lock a man closes when he leaves. He knows he hurt you. Maybe he said things he regrets. Maybe he left in a way he's not proud of.

And shame tells him, "You can't go back now. She'll never forgive you." So he stays away. Not always because he doesn't care, but because he doesn't know how to face you.

Psalm 34 says, "They looked unto him, and were lightened: and their faces were not ashamed." Tonight we pray that God lifts the shame off his face.

If he does reach out, answer warmly and briefly. Don't make him crawl. A short, kind answer can open a door that a long speech would close.`,
    prayer: `Lord, tonight I pray for {HIS_S} heart in the places he's ashamed of. You know what he regrets. You know the words he wishes he could take back.

Lift that weight off him. Let him look to You and be lightened. Let his face not be ashamed. Show him that coming back to do what's right is not weakness.

And prepare my heart too. If {HIS} reaches out, help me answer with grace, not with a list of everything he did. I'm {HER}, and I have needed mercy too. Let me give it, without pretending the hurt didn't happen.

You are nigh unto them that are of a broken heart. Be near to him tonight. Be near to me. Deliver us both from our fears: his fear of facing me, and my fear of being hurt again. In Jesus' name, amen.`,
    signs: [
      { t: "A short message, then nothing", contact: "hot-cold" },
      { t: "A first apology, even a small one", contact: "apology" },
      { t: "\"I've been thinking…\"", contact: "misses" },
      { t: "He asked if I'm okay", contact: "hey" }
    ],
    action: `If he reaches out, answer warmly and briefly. "When He Reaches Out" has words you can use.`,
    journal: `If he apologized tomorrow, what would you want to say back?`,
    audio: ""
  },
  {
    n: 6, lock: "The One In Between", lockSub: "the other woman, family, friends",
    ref: "Psalm 37:1–5",
    psalm: [
      [1, "Fret not thyself because of evildoers, neither be thou envious against the workers of iniquity."],
      [2, "For they shall soon be cut down like the grass, and wither as the green herb."],
      [3, "Trust in the LORD, and do good; so shalt thou dwell in the land, and verily thou shalt be fed."],
      [4, "Delight thyself also in the LORD; and he shall give thee the desires of thine heart."],
      [5, "Commit thy way unto the LORD; trust also in him; and he shall bring it to pass."]
    ],
    word: `Sometimes the lock isn't only inside him. It's someone between you. Another woman. A family member who never liked you. A friend who keeps telling him to move on.

You can't fight these people. And you shouldn't.

Psalm 37 begins, "Fret not thyself." It tells us not to burn up with envy or worry over others, but to trust the LORD and do good.

Tonight we ask God to loosen any grip that isn't from Him, and to protect what is His. We don't curse anyone. We don't wish anyone harm. We simply ask that every influence that doesn't belong in your story loses its power. Tonight, also pray the Psalm 91 Couple's Protection.`,
    prayer: `Lord, tonight I bring to You everyone who stands between {HIS} and me. You know who they are, even the ones I don't know about.

I won't fret. I won't wish anyone harm. I give them to You. If anyone is pulling {HIS} away from what is right, loosen that grip. If someone is speaking lies into his ears, let him hear Your truth louder. If his family is hurting, heal them too. Let only the voices that come from You have a place in his heart.

I commit my way unto You, Lord. I trust also in You. I'm {HER}, and I choose to do good while I wait. Not to fight, or chase, or spy. Let me delight in You first, and let the desires of my heart line up with Yours.

Bring to pass what is good for both of us. In Jesus' name, amen.`,
    signs: [
      { t: "He's spending less time with the outside influence" },
      { t: "Something changed in what was pulling him away" },
      { t: "He seems more like himself again" },
      { t: "He asked if I'm seeing someone", contact: "seeing" },
      { t: "He mentioned the other woman", contact: "other-woman" }
    ],
    action: `Tonight, also pray the Psalm 91 Couple's Protection.`,
    actionLink: "#/psalm91",
    journal: `What worry are you giving to God tonight?`,
    audio: ""
  },
  {
    n: 7, lock: "The Door", lockSub: "the reunion",
    ref: "Psalm 85:8–10",
    psalm: [
      [8, "I will hear what God the LORD will speak: for he will speak peace unto his people, and to his saints: but let them not turn again to folly."],
      [9, "Surely his salvation is nigh them that fear him; that glory may dwell in our land."],
      [10, "Mercy and truth are met together; righteousness and peace have kissed each other."]
    ],
    word: `This is the last lock. The door. Everything we prayed this week leads here.

Psalm 85 says, "Mercy and truth are met together; righteousness and peace have kissed each other." That's what a real reunion looks like. Not pretending nothing happened. Mercy and truth, together.

And remember how God opens doors. Jesus said, "Behold, I stand at the door, and knock." He knocks. He never breaks it down.

So tonight we don't ask God to force {HIS} through any door. We ask Him to knock on his heart, and to give him the courage to open it, if that is God's will. Before you see him, read "The Reunion Conversation." Go in prepared. Go in peace.`,
    prayer: `Lord, this is the seventh night. Thank You for walking with me through every one.

Tonight I bring {HIS} to the door. I don't ask You to drag him through it. You never force a heart. I ask You to knock. Knock on {HIS_S} heart, gently and clearly, and give him the courage to open.

Let mercy and truth meet between us. Let us be honest about what hurt, and merciful about what we can't undo. If it is Your will for us to walk together again, prepare the way: the right words, the right moment, the right place.

And whatever happens, keep my heart clean, the way we started on Night Zero. I'm {HER}, and I'm Yours first. Speak peace to us. Let righteousness and peace kiss each other in our home. I trust You with the door. In Jesus' name, amen.`,
    signs: [
      { t: "He asked to talk in person", contact: "meet" },
      { t: "He said he was wrong", contact: "apology" },
      { t: "He talked about the future" },
      { t: "He asked to come back home", contact: "come-home" }
    ],
    action: `Read "The Reunion Conversation" before you see him.`,
    actionLink: "#/reunion",
    journal: `What do you want your first conversation to feel like?`,
    audio: ""
  }
];

window.PSALM91 = {
  ref: "Psalm 91:1–2, 9–11",
  psalm: [
    [1, "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty."],
    [2, "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust."],
    [9, "Because thou hast made the LORD, which is my refuge, even the most High, thy habitation;"],
    [10, "There shall no evil befall thee, neither shall any plague come nigh thy dwelling."],
    [11, "For he shall give his angels charge over thee, to keep thee in all thy ways."]
  ],
  word: `Psalm 91 has been prayed over homes, soldiers and families for thousands of years. It's a prayer of shelter. We pray it over the two of you, so that what God is restoring is protected from envy, gossip and interference. Pray it any night you feel worried. It's especially for Night 6.`,
  prayer: `Lord, You are my refuge and my fortress. Tonight I, {HER}, place {HIS} and me under the shadow of the Almighty. Cover what is fragile between us.

Where envy, gossip or interference tries to come near, let it not come nigh our dwelling. Give Your angels charge over {HIS}, to keep him in all his ways: at work, with his friends, with his family, in the places where he's tempted to give up. Give Your angels charge over me too, so I walk in peace and not in fear.

I don't ask You to harm anyone, Lord. I ask You to protect what You are restoring. Let no voice that isn't Yours have the last word in our story. You are the most High, and You are our habitation. In You I trust. In Jesus' name, amen.`,
  audio: ""
};

window.SOS = {
  verses: [
    { ref: "Psalm 4:8",  text: "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety." },
    { ref: "Psalm 27:14", text: "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD." }
  ],
  intro: `It's late and your mind won't stop. That's all right. You don't have to fix anything tonight. Breathe with me for a few minutes. Put the phone face down when you're done.`,
  audio: ""
};

/* ---------- When He Reaches Out (10 cenários) ---------- */
window.REACH = [
  { id: "hey", title: "He sends \"hey, how are you?\"",
    tip: `Keep it light. He's testing the water. A warm, short answer tells him the water is calm.`,
    replies: [
      `Hey! I'm doing okay, thanks for asking. How about you?`,
      `Hi :) I'm good. It's nice to hear from you.`,
      `Hey you. Doing well. How's work been?`
    ],
    dont: [`Don't answer with a paragraph about how hard it's been.`, `Don't ask "why are you texting me now?"`, `Don't wait hours on purpose to "teach him a lesson."`] },
  { id: "liked-photo", title: "He likes an old photo",
    tip: `A like is a little knock. You don't need to open the door all the way. Let it be.`,
    replies: [
      `(No message needed. Let it be a quiet sign.)`,
      `If you're already talking: "Saw you found that old photo, haha. Good memories."`
    ],
    dont: [`Don't screenshot it to five friends and then text him "what was that about?"`, `Don't post three new photos to keep his attention.`] },
  { id: "family", title: "He asks about your family",
    tip: `This often means he still feels connected to your life. Answer kindly and leave room.`,
    replies: [
      `Mom's doing well, thanks for asking. She asked about you too.`,
      `Everyone's good! That's sweet of you to ask. How's your family?`
    ],
    dont: [`Don't use your family to make him feel guilty ("Mom cried for weeks").`, `Don't invite him to a family event in the same message.`] },
  { id: "apology", title: "He apologizes",
    tip: `Receive it. You don't have to say everything is fine, and you don't have to punish him either.`,
    replies: [
      `Thank you for saying that. It means a lot to me.`,
      `I appreciate that. I'm sorry for my part too.`,
      `Thank you. I've been doing a lot of thinking too. Maybe we can talk sometime.`
    ],
    dont: [`Don't answer "you should be sorry."`, `Don't list everything he did wrong.`, `Don't pretend the hurt didn't happen if it did.`] },
  { id: "misses", title: "He says he misses you",
    tip: `This is tender. Be honest without pouring out everything at once.`,
    replies: [
      `I've missed you too.`,
      `That's really nice to hear. I've thought about you too.`,
      `I miss you too. Do you want to talk sometime this week?`
    ],
    dont: [`Don't answer "then why did you leave?"`, `Don't send ten messages in a row.`, `Don't decide the whole future in one night of texting.`] },
  { id: "meet", title: "He asks to talk in person",
    tip: `Say yes calmly. Pick a simple, public, comfortable place. Read "The Reunion Conversation" first.`,
    replies: [
      `I'd like that. How about coffee on Saturday?`,
      `Yes, I think that would be good. When works for you?`
    ],
    dont: [`Don't meet somewhere you don't feel safe.`, `Don't bring a list of complaints to the first talk.`, `Don't cancel your own plans for the whole week just to be available.`] },
  { id: "hot-cold", title: "He's warm one day and cold the next",
    tip: `Mixed signals usually mean mixed feelings. Stay steady. Your calm is the anchor, not your chasing.`,
    replies: [
      `(When he's cold: give it space. No need to reply to silence.)`,
      `When he's warm again: "Good to hear from you. Hope your week's going okay."`
    ],
    dont: [`Don't ask "why are you being like this?"`, `Don't match his coldness to hurt him back.`, `Don't double-text when he goes quiet.`] },
  { id: "other-woman", title: "He mentions the other woman",
    tip: `This one hurts. Take a breath before answering. You don't have to answer at all.`,
    replies: [
      `I'd rather not talk about that. I hope you're okay.`,
      `I understand. I'm focusing on taking care of myself right now.`
    ],
    dont: [`Don't insult her or ask questions about her.`, `Don't threaten or give ultimatums.`, `Don't stalk her profile afterward. Pray Psalm 91 instead.`] },
  { id: "seeing", title: "He asks if you're seeing someone",
    tip: `He wants to know if the door is still there. Be honest and simple.`,
    replies: [
      `No, I'm not. I've been focusing on myself. Why do you ask?`,
      `Not right now. Are you?`
    ],
    dont: [`Don't invent someone to make him jealous.`, `Don't answer "why do you care?"`] },
  { id: "come-home", title: "He asks to come back home",
    tip: `This is a big moment. Don't answer only with emotion. Take time to talk first.`,
    replies: [
      `I want that too. Let's sit down and talk about how we do it right this time.`,
      `My heart says yes. Can we talk in person first about what needs to change for both of us?`
    ],
    dont: [`Don't skip the conversation about what went wrong.`, `Don't say yes if you don't feel safe.`, `Don't rush. A good start matters more than a fast one.`] }
];

/* ---------- The Reunion Conversation ---------- */
window.REUNION = {
  intro: `When the day comes to sit down with him, go in prepared. Not with a script, but with a calm heart. Here's how.`,
  before: {
    prayer: `Lord, I'm going to see {HIS} today. Go before me. Guard my mouth from bitterness and my heart from fear. Help me listen more than I speak. Let mercy and truth meet in this conversation. Your will be done. Amen.`,
    steps: [
      `Pray the short prayer above before you leave the house.`,
      `Choose a calm, public place you both know. Coffee is perfect.`,
      `Eat something. Get some sleep. A tired heart says things it doesn't mean.`,
      `Decide ahead of time the one thing you most want him to understand. Just one.`,
      `If you don't feel safe meeting him, don't go. Your safety comes first.`
    ]
  },
  during: {
    steps: [
      `Let him talk first. Say, "I'm glad we're doing this. What's been on your heart?" Then listen without interrupting.`,
      `Ask three gentle questions: "What do you miss about us?" "What do you think went wrong?" "What would you want to be different?"`,
      `Say what hurt you using "I" instead of "you": "I felt alone when…" instead of "You always…"`,
      `Name your boundaries calmly: "If we try again, I need honesty about…" A boundary is not a threat. It's a door with a frame.`,
      `Don't try to solve everything today. "Let's keep talking" is a perfectly good ending.`
    ]
  },
  after: {
    steps: [
      `Day 1: Thank God, then thank him. A short message: "I'm really glad we talked."`,
      `Day 2: Keep living your life. Don't drop everything to be available.`,
      `Day 3: Pray Psalm 91 over both of you again.`,
      `Day 4: Do one simple thing together. A walk, a meal. Nothing big.`,
      `Day 5: If something hurts, say it early and kindly. Don't save it up.`,
      `Day 6: Talk about one small habit you'll each change.`,
      `Day 7: Pray together if he's open to it. If not, pray for him on your own, as you did these seven nights.`
    ]
  }
};

/* ---------- The Reading of His 7 Locks (12 perguntas, pontuação fixa) ---------- */
/* w = pesos somados por cadeado. safety:true = mostra o cartão de segurança */
window.LOCKMAP = [
  { q: "The last time you two talked, he mostly…", o: [
    { t: "argued or raised his voice", w: { anger: 3, pride: 1 } },
    { t: "was cold and short",          w: { pride: 2, forgetting: 1, anger: 1 } },
    { t: "was polite but distant",      w: { longing: 2, shame: 1 } },
    { t: "didn't answer",               w: { forgetting: 3, shame: 1 } } ] },
  { q: "How did the breakup happen?", o: [
    { t: "After a big fight",            w: { anger: 3 } },
    { t: "Slowly, we drifted apart",     w: { forgetting: 2, longing: 1 } },
    { t: "He left for someone else",     w: { between: 3, shame: 2 } },
    { t: "I asked him to leave",         w: { pride: 3, door: 1 } } ] },
  { q: "Is someone influencing him right now?", o: [
    { t: "Yes, another woman",           w: { between: 3, door: 1 } },
    { t: "Yes, his family or friends",   w: { between: 2, pride: 1 } },
    { t: "I'm not sure",                 w: { between: 1 } },
    { t: "No",                           w: { longing: 1 } } ] },
  { q: "Did he move out, or stop coming around?", o: [
    { t: "Yes, he moved out",            w: { door: 3 } },
    { t: "He comes around sometimes",    w: { longing: 2 } },
    { t: "We never lived together",      w: { door: 1 } },
    { t: "We still live together, but distant", w: { pride: 2, anger: 1 } } ] },
  { q: "Has he posted with someone new?", o: [
    { t: "Yes",                          w: { between: 3, pride: 1 } },
    { t: "I think so, but I'm not sure", w: { between: 1, longing: 1 } },
    { t: "No",                           w: { longing: 1 } },
    { t: "He blocked me, I can't see",   w: { forgetting: 2, pride: 1 } } ] },
  { q: "Did he say he doesn't love you anymore?", o: [
    { t: "Yes, clearly",                 w: { forgetting: 2, pride: 2 } },
    { t: "He said it in anger",          w: { anger: 3, pride: 1 } },
    { t: "No, he never said that",       w: { longing: 2, shame: 1 } },
    { t: "He said he's \"confused\"",    w: { longing: 2, between: 1 } } ] },
  { q: "When you see him (or his profile), he seems…", o: [
    { t: "happy, like nothing happened", w: { pride: 3 } },
    { t: "tired or down",                w: { longing: 3 } },
    { t: "busier than ever",             w: { forgetting: 2, longing: 1 } },
    { t: "I don't see him at all",       w: { forgetting: 2, door: 1 } } ] },
  { q: "Did he do something he might regret?", o: [
    { t: "Yes, he hurt me deeply",       w: { shame: 3 } },
    { t: "He said hurtful things",       w: { shame: 2, anger: 1 } },
    { t: "Not really",                   w: { pride: 1 } },
    { t: "I did things I regret too",    w: { shame: 1, anger: 1 } } ] },
  { q: "Does he still keep things you gave him, or photos of you?", o: [
    { t: "Yes, as far as I know",        w: { longing: 3 } },
    { t: "He deleted everything",        w: { forgetting: 3 } },
    { t: "He gave things back",          w: { pride: 2, door: 1 } },
    { t: "I don't know",                 w: { forgetting: 1 } } ] },
  { q: "How does his family feel about you?", o: [
    { t: "They like me",                 w: { longing: 1 } },
    { t: "They never liked me",          w: { between: 3 } },
    { t: "They're taking his side",      w: { between: 2, pride: 1 } },
    { t: "I don't know",                 w: {} } ] },
  { q: "If he saw you tomorrow, what do you think he'd feel?", o: [
    { t: "Nervous or embarrassed",       w: { shame: 3 } },
    { t: "Happy, but he'd hide it",      w: { longing: 3, pride: 1 } },
    { t: "Still angry",                  w: { anger: 3 } },
    { t: "Nothing, he'd act indifferent", w: { pride: 2, forgetting: 2 } } ] },
  { q: "And you, how do you feel when you think about seeing him?", o: [
    { t: "Hopeful",                      w: { door: 1 } },
    { t: "Nervous",                      w: { door: 2 } },
    { t: "Tired of waiting",             w: { door: 3 } },
    { t: "I'm afraid of him",            w: {}, safety: true } ] }
];
