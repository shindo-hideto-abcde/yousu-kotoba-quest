"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  stage: 1 | 2 | 3;
  category: string;
  scene: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  compare: string;
};

const QUESTIONS: Question[] = [
  { stage: 1, category: "あめ", scene: "🌧️", prompt: "大つぶの あめが、おとを 立てて はげしく ふっています。", options: ["しとしと", "ざあざあ", "さっと"], answer: "ざあざあ", explanation: "「ざあざあ」は、あめが はげしく、たくさん ふる ようすです。", compare: "しとしと＝よわく しずかに つづく／さっと＝みじかい あいだに きゅうに ふる" },
  { stage: 1, category: "あめ", scene: "☔", prompt: "あさから、こまかい あめが しずかに ふりつづいています。", options: ["ぽつぽつ", "ざあざあ", "しとしと"], answer: "しとしと", explanation: "「しとしと」は、よわい あめが しずかに ふりつづく ようすです。", compare: "ぽつぽつ＝すこしずつ ふりはじめる／ざあざあ＝はげしく ふる" },
  { stage: 1, category: "あめ", scene: "🌦️", prompt: "とおりあめが きゅうに ふり、すぐに やみました。", options: ["さっと", "しとしと", "ぽつぽつ"], answer: "さっと", explanation: "「さっと」は、うごきや へんかが すばやく、みじかい じかんで おこる ようすです。", compare: "しとしと＝しずかに つづく／ぽつぽつ＝すこしずつ、あいだを おいて" },
  { stage: 1, category: "わらいかた", scene: "😊", prompt: "ともだちの はっぴょうを きき、うれしそうな かおで ほほえんでいます。", options: ["にこにこ", "にやにや", "げらげら"], answer: "にこにこ", explanation: "「にこにこ」は、うれしそうに、あかるく ほほえむ ようすです。", compare: "にやにや＝こえを 出さず、わけありげに わらう／げらげら＝大ごえで わらう" },
  { stage: 1, category: "わらいかた", scene: "🤭", prompt: "おもしろい まんがを、こえを おさえて 小さく わらいながら よみました。", options: ["くすくす", "にっこり", "からから"], answer: "くすくす", explanation: "「くすくす」は、こえを おさえて 小さく わらう ようすです。", compare: "にっこり＝一ど ほほえむ／からから＝あかるく 大きな こえで わらう" },
  { stage: 1, category: "あるきかた", scene: "🚶", prompt: "としょしつなので、足おとを 立てないように あるきました。", options: ["どたどた", "そろそろ", "すたすた"], answer: "そろそろ", explanation: "「そろそろ」は、おとを 立てないように しずかに うごく ようすを あらわすことが あります。", compare: "どたどた＝大きな 足おと／すたすた＝まよわず はやく あるく" },
  { stage: 1, category: "あるきかた", scene: "🏃", prompt: "おくれそうなので、前を むいて まよわず はやく あるきました。", options: ["のろのろ", "すたすた", "よろよろ"], answer: "すたすた", explanation: "「すたすた」は、足どり かるく、まよわず はやく あるく ようすです。", compare: "のろのろ＝うごきが おそい／よろよろ＝足もとが あんていしない" },
  { stage: 1, category: "はなしかた", scene: "🙋", prompt: "きく人に わかるように、ことばを くぎって こたえました。", options: ["ぼそぼそ", "はきはき", "がみがみ"], answer: "はきはき", explanation: "「はきはき」は、ことばや たいどが はっきりしている ようすです。", compare: "ぼそぼそ＝小さく、はっきりしない／がみがみ＝つよく しかるように いう" },
  { stage: 2, category: "見る", scene: "👀", prompt: "「じろじろ 見る」に いちばん ちかい せつめいは どれ？", options: ["みじかい あいだだけ 見る", "とおくを ながめる", "えんりょなく なんども 見る"], answer: "えんりょなく なんども 見る", explanation: "「じろじろ」は、あいてが いやがるほど、えんりょなく なんども 見る ようすです。", compare: "ちらり＝ほんの みじかい あいだ 見る／じっと＝目を そらさず、よく 見る" },
  { stage: 2, category: "ひかり", scene: "✨", prompt: "「きらきら」と「ぎらぎら」。なつの つよい たいように あうのは？", options: ["きらきら", "ぎらぎら", "どちらも おなじ"], answer: "ぎらぎら", explanation: "「ぎらぎら」は、つよく まぶしい ひかり。ときには、どぎつい かんじも あらわします。", compare: "きらきら＝小さな ひかりが うつくしく またたく／ぎらぎら＝つよく てりつける" },
  { stage: 2, category: "手ざわり", scene: "🪨", prompt: "「ざらざら」している ものは、どれ？", options: ["みがいた ガラス", "かみやすり", "やわらかい もうふ"], answer: "かみやすり", explanation: "「ざらざら」は、おもてに 小さな でこぼこがあり、なめらかでない ようすです。", compare: "つるつる＝なめらか／ふわふわ＝かるく、やわらかい" },
  { stage: 2, category: "きもち", scene: "💓", prompt: "はっぴょうの ばんを まっていて、むねが「どきどき」。どんな きもち？", options: ["きんちょうしている", "たいくつしている", "あんしんしている"], answer: "きんちょうしている", explanation: "「どきどき」は、うんどうや きんちょうなどで、しんぞうが つよく うつように かんじる ようすです。", compare: "わくわく＝たのしみで こころが はずむ／ほっと＝しんぱいが なくなり あんしんする" },
  { stage: 2, category: "うごき", scene: "⚽", prompt: "「ころころ」と「ごろごろ」。小さな ビー玉に あうのは？", options: ["ころころ", "ごろごろ", "どちらも あわない"], answer: "ころころ", explanation: "「ころころ」は、小さく かるい ものが なめらかに ころがる かんじです。", compare: "ごろごろ＝大きい おもい ものが、おとを 立てて ころがる かんじ" },
  { stage: 2, category: "ねむり", scene: "😴", prompt: "あかちゃんが きもちよさそうに、しずかに ねむっています。", options: ["ぐっすり", "うとうと", "すやすや"], answer: "すやすや", explanation: "「すやすや」は、しずかに きもちよさそうに ねむる ようすです。", compare: "ぐっすり＝ふかく ねむる／うとうと＝あさく、ねむりかける" },
  { stage: 2, category: "人", scene: "😏", prompt: "ひみつの いたずらを おもいつき、こえを 出さずに わらっています。", options: ["にこにこ", "にやにや", "けらけら"], answer: "にやにや", explanation: "「にやにや」は、こえを 出さず、なにか わけが ありそうな わらいかたです。", compare: "にこにこ＝あかるく うれしそう／けらけら＝かん高い こえで わらう" },
  { stage: 3, category: "文づくり", scene: "🍂", prompt: "あきの おちばの ようすが、いちばん よく つたわる 文は？", options: ["おちばが おちた。", "おちばが、ひらひらと まいおちた。", "おちばが、どたどたと まいおちた。"], answer: "おちばが、ひらひらと まいおちた。", explanation: "「ひらひら」で、うすく かるい はが ゆれながら おちる ようすが つたわります。", compare: "どたどた＝人などが 大きな 足おとを 立てる ようす" },
  { stage: 3, category: "文づくり", scene: "🐕", prompt: "あめに ぬれた いぬが、からだを ふる ようすに ぴったりの 文は？", options: ["いぬは からだを、ぶるぶると ふるわせた。", "いぬは からだを、きらきらと ふるわせた。", "いぬは からだを、しとしとと ふるわせた。"], answer: "いぬは からだを、ぶるぶると ふるわせた。", explanation: "「ぶるぶる」は、さむさや こわさなどで、からだが 小さく ふるえる ようすです。", compare: "きらきら＝ひかる ようす／しとしと＝よわい あめが しずかに つづく ようす" },
  { stage: 3, category: "文づくり", scene: "🤫", prompt: "ねている おとうとを おこさない ばめんに、ぴったりの 文は？", options: ["ドアを、ばたんと しめた。", "ドアを、そっと しめた。", "ドアを、ぐいぐい しめた。"], answer: "ドアを、そっと しめた。", explanation: "「そっと」は、おとを 立てないように、きを つけて しずかに する ようすです。", compare: "ばたん＝大きな おと／ぐいぐい＝つよく おしたり、すすめたりする" },
  { stage: 3, category: "文づくり", scene: "🌟", prompt: "よぞらの ほしを うつくしく あらわした 文は？", options: ["ほしが、ぎゅうぎゅう ひかる。", "ほしが、きらきら ひかる。", "ほしが、じめじめ ひかる。"], answer: "ほしが、きらきら ひかる。", explanation: "「きらきら」は、小さな ひかりが うつくしく またたく ようすです。", compare: "ぎゅうぎゅう＝すきまなく つまる／じめじめ＝しめって いやな かんじ" },
  { stage: 3, category: "文づくり", scene: "🐢", prompt: "かめの うごきが よく つたわる 文は？", options: ["かめが、のろのろと みちを すすむ。", "かめが、さっと みちを すすむ。", "かめが、ぴょんぴょんと みちを すすむ。"], answer: "かめが、のろのろと みちを すすむ。", explanation: "「のろのろ」は、うごきが おそく、なかなか すすまない ようすです。", compare: "さっと＝すばやく／ぴょんぴょん＝つづけて かるく はねる" },
  { stage: 3, category: "文づくり", scene: "🎁", prompt: "プレゼントの はこを あける まえの きもちが、よく つたわる 文は？", options: ["わくわくしながら、リボンを ほどいた。", "じめじめしながら、リボンを ほどいた。", "よろよろしながら、リボンを ほどいた。"], answer: "わくわくしながら、リボンを ほどいた。", explanation: "「わくわく」は、たのしみで こころが はずむ ようすです。", compare: "じめじめ＝しめっている／よろよろ＝足もとが あんていしない" },
];

const WORD_GROUPS = [
  { title: "あめ・水", icon: "🌧️", words: ["ざあざあ", "しとしと", "さっと", "ぽつぽつ", "ぱらぱら", "ばらばら"] },
  { title: "わらう", icon: "😄", words: ["にこにこ", "にっこり", "にやにや", "くすくす", "けらけら", "げらげら"] },
  { title: "あるく・うごく", icon: "🚶", words: ["すたすた", "のろのろ", "よろよろ", "そろそろ", "どたどた", "ぴょんぴょん"] },
  { title: "見る・はなす", icon: "👀", words: ["じっと", "ちらり", "じろじろ", "はきはき", "ぼそぼそ", "がみがみ"] },
  { title: "ひかり・手ざわり", icon: "✨", words: ["きらきら", "ぎらぎら", "つるつる", "ざらざら", "ふわふわ", "べたべた"] },
  { title: "きもち・からだ", icon: "💓", words: ["どきどき", "わくわく", "ほっと", "びくびく", "すやすや", "うとうと"] },
  { title: "ものの うごき", icon: "🌀", words: ["ころころ", "ごろごろ", "ひらひら", "ゆらゆら", "ぐらぐら", "ぶるぶる"] },
];

const STAGE_INFO = [
  { n: 1, label: "ことばを 見つける", icon: "🔎" },
  { n: 2, label: "ちがいを かんがえる", icon: "📖" },
  { n: 3, label: "文で つかう", icon: "✏️" },
];

type FlashCard = { word: string; icon: string; meaning: string; compare: string };
type Rank = { name: string; score: number; date: string };

const FLASH_CARDS: FlashCard[] = [
  { word: "ざあざあ", icon: "🌧️", meaning: "あめが はげしく、たくさん ふる ようす。", compare: "しとしとは、よわく しずかに つづく。" },
  { word: "しとしと", icon: "☔", meaning: "よわい あめが、しずかに ふりつづく ようす。", compare: "ざあざあよりも、あめが よわくて しずか。" },
  { word: "さっと", icon: "🌦️", meaning: "すばやく、みじかい じかんで おこる ようす。", compare: "あめなら、きゅうに ふって すぐ やむ かんじ。" },
  { word: "ぽつぽつ", icon: "💧", meaning: "すこしずつ、あいだを おいて つづく ようす。", compare: "あめの ふりはじめにも つかう。" },
  { word: "にこにこ", icon: "😊", meaning: "うれしそうに、あかるく ほほえむ ようす。", compare: "にやにやは、わけが ありそうな わらいかた。" },
  { word: "にやにや", icon: "😏", meaning: "こえを 出さず、わけが ありそうに わらう ようす。", compare: "にこにこと ちがい、あいてが ふしぎに おもうことも ある。" },
  { word: "くすくす", icon: "🤭", meaning: "こえを おさえて、小さく わらう ようす。", compare: "げらげらは、大ごえで わらう。" },
  { word: "げらげら", icon: "🤣", meaning: "おかしくて、大きな こえで わらう ようす。", compare: "くすくすよりも、こえが 大きい。" },
  { word: "すたすた", icon: "🚶", meaning: "まよわず、はやく あるく ようす。", compare: "のろのろは、ゆっくりで なかなか すすまない。" },
  { word: "のろのろ", icon: "🐢", meaning: "うごきが おそく、なかなか すすまない ようす。", compare: "すたすたとは、はやさが ちがう。" },
  { word: "よろよろ", icon: "🥴", meaning: "足もとが ふらついて、あぶなそうな ようす。", compare: "のろのろは おそい、よろよろは ふらつく。" },
  { word: "どたどた", icon: "👣", meaning: "大きな 足おとを 立てて うごく ようす。", compare: "そろそろは、おとを 立てずに うごく。" },
  { word: "はきはき", icon: "🙋", meaning: "ことばや たいどが、はっきりしている ようす。", compare: "ぼそぼそは、こえが 小さく はっきりしない。" },
  { word: "ぼそぼそ", icon: "🤐", meaning: "小さな こえで、はっきりしない はなしかた。", compare: "はきはきとは、こえの つたわりかたが ちがう。" },
  { word: "じっと", icon: "👀", meaning: "うごかず、目を そらさない ようす。", compare: "ちらりは、ほんの みじかい あいだ 見る。" },
  { word: "じろじろ", icon: "🔍", meaning: "えんりょなく、なんども 見る ようす。", compare: "あいてが いやな きもちに なることも ある。" },
  { word: "きらきら", icon: "✨", meaning: "小さな ひかりが、うつくしく またたく ようす。", compare: "ぎらぎらは、つよく まぶしい ひかり。" },
  { word: "ぎらぎら", icon: "☀️", meaning: "つよく、まぶしく ひかる ようす。", compare: "きらきらよりも、ひかりが つよい。" },
  { word: "ざらざら", icon: "🪨", meaning: "おもてに 小さな でこぼこが ある ようす。", compare: "つるつるは、なめらかで でこぼこが ない。" },
  { word: "ふわふわ", icon: "☁️", meaning: "かるくて、やわらかい ようす。", compare: "もうふや わたの ようすに ぴったり。" },
  { word: "どきどき", icon: "💓", meaning: "しんぞうが、つよく うつように かんじる ようす。", compare: "きんちょうや うれしい ときに つかう。" },
  { word: "わくわく", icon: "🎁", meaning: "たのしみで、こころが はずむ ようす。", compare: "ほっとは、しんぱいが なくなった とき。" },
  { word: "すやすや", icon: "😴", meaning: "しずかに、きもちよさそうに ねむる ようす。", compare: "うとうとは、あさく ねむりかける ようす。" },
  { word: "ころころ", icon: "⚽", meaning: "小さく かるい ものが、なめらかに ころがる ようす。", compare: "ごろごろは、大きく おもい ものが ころがる かんじ。" },
  { word: "ひらひら", icon: "🍂", meaning: "うすく かるい ものが、ゆれながら うごく ようす。", compare: "はなびらや おちばに ぴったり。" },
  { word: "ぶるぶる", icon: "🐕", meaning: "さむさや こわさで、からだが 小さく ふるえる ようす。", compare: "大きく ゆれる ようすとは ちがう。" },
];

const MORE_FLASH_CARDS: FlashCard[] = [
  { word: "ぱらぱら", icon: "🌦️", meaning: "あめなどが、まばらに ふる ようす。", compare: "ぽつぽつよりも、つづけて ふる かんじ。" },
  { word: "ばらばら", icon: "🌧️", meaning: "大つぶの あめなどが、おとを 立てて ふる ようす。", compare: "ものが ひとつに まとまっていない ようすにも つかう。" },
  { word: "がやがや", icon: "👥", meaning: "たくさんの 人が、にぎやかに はなす ようす。", compare: "しーんは、おとが なく しずかな ようす。" },
  { word: "しーん", icon: "🤫", meaning: "おとが なく、とても しずかな ようす。", compare: "がやがやとは、まわりの おとが ちがう。" },
  { word: "こそこそ", icon: "🥷", meaning: "人に 見つからないように、しずかに うごく ようす。", compare: "そろそろよりも、かくれて うごく かんじ。" },
  { word: "がみがみ", icon: "😠", meaning: "つよい こえで、なんども しかる ようす。", compare: "はきはきは、はっきり はなす ようす。" },
  { word: "ちらり", icon: "👁️", meaning: "ほんの みじかい あいだだけ 見る ようす。", compare: "じっとは、目を そらさず 見つづける。" },
  { word: "きょろきょろ", icon: "👀", meaning: "あちらこちらを、つづけて 見まわす ようす。", compare: "じろじろは、ひとつの ものを なんども 見る かんじ。" },
  { word: "つるつる", icon: "🥚", meaning: "おもてが、なめらかで でこぼこが ない ようす。", compare: "ざらざらとは、手ざわりが はんたい。" },
  { word: "べたべた", icon: "🍯", meaning: "ものが くっつくような、ねばりけの ある ようす。", compare: "つるつるとは、さわった かんじが ちがう。" },
  { word: "ほっと", icon: "😌", meaning: "しんぱいが なくなり、あんしんする ようす。", compare: "どきどきしていた こころが、おちついた とき。" },
  { word: "びくびく", icon: "😨", meaning: "こわがって、いつも おびえている ようす。", compare: "わくわくは、たのしみな きもち。" },
  { word: "うとうと", icon: "🥱", meaning: "あさく ねむり、ねむりかけている ようす。", compare: "すやすやは、しずかに ねむっている。" },
  { word: "ぐっすり", icon: "🛌", meaning: "とても ふかく ねむっている ようす。", compare: "うとうとよりも、ねむりが ふかい。" },
  { word: "ごろごろ", icon: "🪨", meaning: "大きく おもい ものが、ころがる ようす。", compare: "ころころは、小さく かるい ものに ぴったり。" },
  { word: "ゆらゆら", icon: "🕯️", meaning: "ゆっくり、左右に ゆれうごく ようす。", compare: "ぐらぐらは、大きく あぶなそうに ゆれる。" },
];

const ALL_FLASH_CARDS = [...FLASH_CARDS, ...MORE_FLASH_CARDS];

const COVERAGE_QUESTIONS: Question[] = ALL_FLASH_CARDS.map((card, index) => {
  const level = (Math.floor(index / 14) + 1) as 1 | 2 | 3;
  const levelCards = ALL_FLASH_CARDS.slice((level - 1) * 14, level * 14);
  const place = index % 14;
  const choices = [card.word, levelCards[(place + 5) % levelCards.length].word, levelCards[(place + 9) % levelCards.length].word];
  const options = choices.map((_, i) => choices[(i + index) % 3]);
  return {
    stage: level,
    category: level === 1 ? "きほん" : level === 2 ? "ちがい" : "つかいわけ",
    scene: card.icon,
    prompt: level === 1 ? `${card.meaning}\nぴったりの ことばは？` : level === 2 ? `${card.meaning}\nにた ことばと くらべて えらぼう。` : `「${card.meaning}」と つたえたい。\nいちばん ぴったりの ことばは？`,
    options,
    answer: card.word,
    explanation: `「${card.word}」は、${card.meaning}`,
    compare: card.compare,
  };
});

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [screen, setScreen] = useState<"home" | "cards" | "level-select" | "game" | "result" | "time-ready" | "time-game" | "time-result" | "ranking" | "words">("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardOpen, setCardOpen] = useState(false);
  const [timeQuestions, setTimeQuestions] = useState<Question[]>([]);
  const [timeIndex, setTimeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeScore, setTimeScore] = useState(0);
  const [timeSelected, setTimeSelected] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [rankings, setRankings] = useState<Rank[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const saved = Number(localStorage.getItem("yousu-best") || 0);
    setBest(saved);
    const savedRanks = JSON.parse(localStorage.getItem("yousu-ranking") || "[]") as Rank[];
    setRankings(savedRanks);
  }, []);

  useEffect(() => {
    if (screen !== "time-game") return;
    const timer = window.setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "time-game" || timeLeft !== 0) return;
    const entry = { name: playerName.trim() || "ななし", score: timeScore, date: new Date().toLocaleDateString("ja-JP") };
    const nextRanks = [...rankings, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    setRankings(nextRanks);
    localStorage.setItem("yousu-ranking", JSON.stringify(nextRanks));
    setScreen("time-result");
  }, [timeLeft, screen, playerName, timeScore, rankings]);

  const current = questions[index];
  const flashCard = ALL_FLASH_CARDS[cardIndex];
  const timeCurrent = timeQuestions[timeIndex];
  const progress = questions.length ? ((index + (selected ? 1 : 0)) / questions.length) * 100 : 0;
  const stars = useMemo(() => (score >= 12 ? 3 : score >= 9 ? 2 : score >= 5 ? 1 : 0), [score]);

  function startGame(level: 1 | 2 | 3 = selectedLevel) {
    const picked = shuffle(COVERAGE_QUESTIONS.filter(q => q.stage === level));
    setSelectedLevel(level);
    setQuestions(picked);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setScreen("game");
  }

  function startCards() {
    setCardIndex(0);
    setCardOpen(false);
    setScreen("cards");
  }

  function nextCard() {
    if (cardIndex === ALL_FLASH_CARDS.length - 1) {
      setScreen("level-select");
      return;
    }
    setCardIndex(i => i + 1);
    setCardOpen(false);
  }

  function startTimeAttack() {
    setTimeQuestions(shuffle(COVERAGE_QUESTIONS));
    setTimeIndex(0);
    setTimeLeft(60);
    setTimeScore(0);
    setTimeSelected(null);
    setScreen("time-game");
  }

  function chooseTime(option: string) {
    if (timeSelected || !timeCurrent) return;
    setTimeSelected(option);
    if (option === timeCurrent.answer) setTimeScore(s => s + 1);
    window.setTimeout(() => {
      setTimeIndex(i => {
        if (i + 1 < timeQuestions.length) return i + 1;
        setTimeQuestions(shuffle(COVERAGE_QUESTIONS));
        return 0;
      });
      setTimeSelected(null);
    }, 420);
  }

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore(s => s + 1);
  }

  function next() {
    if (index === questions.length - 1) {
      const finalScore = score;
      if (finalScore > best) {
        setBest(finalScore);
        localStorage.setItem("yousu-best", String(finalScore));
      }
      setScreen("result");
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  }

  function readAloud() {
    if (!current || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.prompt);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")} aria-label="ホームへ もどる">
          <span className="brand-flask">⚗</span><span>ようすことば<span className="brand-lab">けんきゅうじょ</span></span>
        </button>
        <div className="top-actions">
          <button className="small-button rank-link" onClick={() => setScreen("ranking")}>🏆 ランキング</button>
          <button className="small-button" onClick={() => setScreen("words")}>📚 ことばずかん</button>
          <div className="best-score" aria-label={`さいこうきろく ${best}てん`}>⭐ <strong>{best}</strong>/14</div>
        </div>
      </header>

      {screen === "home" && (
        <section className="home-screen">
          <div className="hero-copy">
            <div className="eyebrow">🔬 小学3年 こくご</div>
            <h1>ぴったりの<br /><span>ようすことば</span>を<br />見つけよう！</h1>
            <p>にている ことばでも、つたわる ようすは ちがいます。<br />よく かんがえて、ことばはかせを めざそう。</p>
            <button className="start-button" onClick={startCards}><span>カードで まなぶ</span><b>→</b></button>
            <div className="quick-links"><button onClick={() => setScreen("level-select")}>クエストから</button><button onClick={() => setScreen("time-ready")}>タイムアタック</button></div>
          </div>
          <div className="demo-card" aria-label="ためしもんだい">
            <div className="card-label"><span>⚗</span> ためしもんだい</div>
            <div className="scientist" aria-hidden="true">🧑‍🔬</div>
            <p className="demo-question">あさから、こまかい あめが<br />しずかに ふりつづいています。</p>
            <div className="demo-options"><span>ざあざあ</span><strong>しとしと ✦</strong><span>さっと</span></div>
            <div className="hint-bubble">おなじ「あめ」でも、<br />ふりかたが ちがうね！</div>
          </div>
          <div className="stage-road" aria-label="がくしゅうの 3だんかい">
            <div><b>1</b><span>🃏</span><em>カードで まなぶ</em></div>
            <div><b>2</b><span>🔬</span><em>クエストに ちょうせん</em></div>
            <div><b>3</b><span>⏱️</span><em>タイムアタック</em></div>
          </div>
        </section>
      )}

      {screen === "cards" && flashCard && (
        <section className="cards-screen">
          <div className="lesson-head">
            <div><span className="stage-chip">ステップ 1</span><strong>カードで いみを おぼえよう</strong></div>
            <div className="question-count"><strong>{cardIndex + 1}</strong> / {ALL_FLASH_CARDS.length}</div>
          </div>
          <div className="progress-track"><span style={{ width: `${((cardIndex + 1) / ALL_FLASH_CARDS.length) * 100}%` }} /></div>
          <button className={`flash-card ${cardOpen ? "open" : ""}`} onClick={() => setCardOpen(v => !v)} aria-label={`${flashCard.word}の カード。おすと いみが 見られます`}>
            {!cardOpen ? (
              <div className="flash-front"><span>{flashCard.icon}</span><h2>{flashCard.word}</h2><p>カードを おして<br />いみを 見よう</p></div>
            ) : (
              <div className="flash-back"><div className="flash-word">{flashCard.icon} {flashCard.word}</div><h3>どんな ようす？</h3><p>{flashCard.meaning}</p><div><b>くらべて はっけん</b><span>{flashCard.compare}</span></div></div>
            )}
          </button>
          <div className="card-controls">
            <button disabled={cardIndex === 0} onClick={() => { setCardIndex(i => i - 1); setCardOpen(false); }}>← まえ</button>
            {!cardOpen && <button className="reveal-button" onClick={() => setCardOpen(true)}>いみを 見る</button>}
            {cardOpen && <button className="next-button card-next" onClick={nextCard}>{cardIndex === ALL_FLASH_CARDS.length - 1 ? "クエストへ" : "つぎの カード"} →</button>}
          </div>
          <button className="skip-link" onClick={() => setScreen("level-select")}>カードを とばして クエストへ</button>
        </section>
      )}

      {screen === "level-select" && (
        <section className="level-screen">
          <div className="level-heading"><div className="eyebrow">🔬 ステップ 2</div><h2>クエストの レベルを えらぼう</h2><p>どの レベルも 14もん。3つの レベルで、42この ことばを ぜんぶ たしかめられるよ。</p></div>
          <div className="level-grid">
            <button className="level-card level-1" onClick={() => startGame(1)}><span className="level-icon">🌱</span><b>レベル 1</b><h3>きほんの ことば</h3><p>よく つかう ことばの<br />いみを たしかめよう。</p><div>ざあざあ・にこにこ・すたすた など</div><em>14もんに ちょうせん →</em></button>
            <button className="level-card level-2" onClick={() => startGame(2)}><span className="level-icon">🔎</span><b>レベル 2</b><h3>にた ことばの ちがい</h3><p>にている ことばを<br />くらべて えらぼう。</p><div>じっと・きらきら・どきどき など</div><em>14もんに ちょうせん →</em></button>
            <button className="level-card level-3" onClick={() => startGame(3)}><span className="level-icon">🏆</span><b>レベル 3</b><h3>ことばの つかいわけ</h3><p>いみを よく よんで<br />ぴったりを 見つけよう。</p><div>こそこそ・ちらり・ほっと など</div><em>14もんに ちょうせん →</em></button>
          </div>
          <button className="skip-link" onClick={() => setScreen("home")}>← ホームへ もどる</button>
        </section>
      )}

      {screen === "game" && current && (
        <section className="game-screen">
          <div className="game-status">
            <div><span className="stage-chip">ステージ {current.stage}</span><strong>{STAGE_INFO[current.stage - 1].label}</strong></div>
            <div className="question-count">もんだい <strong>{index + 1}</strong> / {questions.length}</div>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>

          <article className="question-card">
            <div className="question-topline"><span className="category">{current.category}</span><button className="sound-button" onClick={readAloud}>🔊 よみあげ</button></div>
            <div className="scene" aria-hidden="true">{current.scene}</div>
            <h2>{current.prompt}</h2>
            <p className="instruction">いちばん ぴったりの ことばや 文を えらぼう。</p>
            <div className="answer-grid">
              {current.options.map((option, i) => {
                const state = selected ? option === current.answer ? "correct" : option === selected ? "wrong" : "muted" : "";
                return <button key={option} className={state} onClick={() => choose(option)} disabled={!!selected}><span>{["A", "B", "C"][i]}</span>{option}</button>;
              })}
            </div>
            {selected && (
              <div className={`feedback ${selected === current.answer ? "is-correct" : "is-wrong"}`} role="status">
                <div className="feedback-title">{selected === current.answer ? "🎉 せいかい！" : "💡 おしい！ ぴったりなのは「" + current.answer + "」"}</div>
                <p>{current.explanation}</p>
                <div className="compare-note"><b>くらべて はっけん</b><span>{current.compare}</span></div>
                <button className="next-button" onClick={next}>{index === questions.length - 1 ? "けっかを 見る" : "つぎの もんだいへ"} →</button>
              </div>
            )}
          </article>
        </section>
      )}

      {screen === "result" && (
        <section className="result-screen">
          <div className="result-burst">{stars === 3 ? "🏆" : stars === 2 ? "🔬" : "📘"}</div>
          <div className="eyebrow">けんきゅう けっか</div>
          <h2>{score}<small> / {questions.length}てん</small></h2>
          <div className="stars" aria-label={`${stars}つぼし`}>{[0,1,2].map(i => <span key={i} className={i < stars ? "earned" : ""}>★</span>)}</div>
          <h3>{score >= 12 ? "ようすことば はかせ！" : score >= 9 ? "ちがいが 見えてきたね！" : "ことばずかんで けんきゅうしよう！"}</h3>
          <p>ことばを くらべると、人や ものの ようすが<br />もっと くわしく つたわるように なります。</p>
          <div className="next-mission"><span>3つの レベルを まなんだら</span><b>⏱️ タイムアタックで きろくに ちょうせん</b></div>
          <div className="result-actions"><button className="start-button" onClick={() => setScreen("level-select")}>ほかの レベルへ →</button><button className="small-button" onClick={() => startGame(selectedLevel)}>もう一ど</button><button className="small-button" onClick={() => setScreen("time-ready")}>タイムアタック</button></div>
        </section>
      )}

      {screen === "time-ready" && (
        <section className="time-ready-screen">
          <div className="timer-hero">⏱️</div>
          <div className="eyebrow">ステップ 3</div>
          <h2>60びょう<br /><span>タイムアタック</span></h2>
          <p>せつめいは 出ません。<br />できるだけ はやく、たくさん こたえよう！</p>
          <label className="name-field"><span>なまえ</span><input value={playerName} onChange={e => setPlayerName(e.target.value.slice(0, 8))} placeholder="ななし" maxLength={8} /></label>
          <button className="start-button" onClick={startTimeAttack}>よーい、スタート！ →</button>
          <button className="skip-link" onClick={() => setScreen("ranking")}>🏆 ランキングを 見る</button>
        </section>
      )}

      {screen === "time-game" && timeCurrent && (
        <section className="time-game-screen">
          <div className="time-scorebar">
            <div className={`big-timer ${timeLeft <= 10 ? "danger" : ""}`}>⏱️ <strong>{timeLeft}</strong><span>びょう</span></div>
            <div className="live-score">せいかい <strong>{timeScore}</strong>こ</div>
          </div>
          <article className="question-card speed-card">
            <div className="scene" aria-hidden="true">{timeCurrent.scene}</div>
            <h2>{timeCurrent.prompt}</h2>
            <div className="answer-grid">
              {timeCurrent.options.map((option, i) => {
                const state = timeSelected ? option === timeCurrent.answer ? "correct" : option === timeSelected ? "wrong" : "muted" : "";
                return <button key={option} className={state} onClick={() => chooseTime(option)} disabled={!!timeSelected}><span>{["A", "B", "C"][i]}</span>{option}</button>;
              })}
            </div>
          </article>
          <p className="speed-hint">こたえると、すぐ つぎの もんだいに すすむよ！</p>
        </section>
      )}

      {screen === "time-result" && (
        <section className="result-screen time-result">
          <div className="result-burst">⏱️</div>
          <div className="eyebrow">タイムアップ！</div>
          <h2>{timeScore}<small> こ せいかい</small></h2>
          <h3>{timeScore >= 15 ? "すごい！ ことばマスター！" : timeScore >= 10 ? "はやく せいかくに えらべたね！" : "カードで おぼえて、もう一ど！"}</h3>
          <p>「{playerName.trim() || "ななし"}」さんの きろくを<br />ランキングに のこしました。</p>
          <div className="result-actions"><button className="start-button" onClick={() => setScreen("ranking")}>ランキングを 見る →</button><button className="small-button" onClick={startTimeAttack}>もう一ど</button></div>
        </section>
      )}

      {screen === "ranking" && (
        <section className="ranking-screen">
          <div className="words-heading"><div><div className="eyebrow">🏆 この たんまつの きろく</div><h2>タイムアタック ランキング</h2><p>60びょうで いくつ せいかいできたかな？</p></div><button className="close-button" onClick={() => setScreen("home")}>× とじる</button></div>
          {rankings.length ? <ol className="rank-list">{rankings.map((rank, i) => <li key={`${rank.date}-${rank.name}-${i}`} className={i < 3 ? `top-${i + 1}` : ""}><b className="rank-num">{i + 1}</b><span className="rank-medal">{["🥇", "🥈", "🥉"][i] || "🔹"}</span><strong>{rank.name}</strong><em>{rank.date}</em><span className="rank-score">{rank.score}<small>こ</small></span></li>)}</ol> : <div className="empty-rank"><span>🏁</span><h3>まだ きろくが ありません</h3><p>タイムアタックに ちょうせんしよう！</p></div>}
          <div className="ranking-actions"><button className="start-button compact" onClick={() => setScreen("time-ready")}>タイムアタックへ →</button>{rankings.length > 0 && <button className="clear-button" onClick={() => { if (window.confirm("ランキングを ぜんぶ けしますか？")) { setRankings([]); localStorage.removeItem("yousu-ranking"); } }}>きろくを けす</button>}</div>
        </section>
      )}

      {screen === "words" && (
        <section className="words-screen">
          <div className="words-heading"><div><div className="eyebrow">📚 ことばを くらべよう</div><h2>ようすことば ずかん</h2><p>おなじ なかまの ことばを こえに 出して、ちがいを そうぞうしてみよう。</p></div><button className="close-button" onClick={() => setScreen("home")}>× とじる</button></div>
          <div className="word-groups">
            {WORD_GROUPS.map(group => <article key={group.title}><div className="group-title"><span>{group.icon}</span><h3>{group.title}</h3></div><div>{group.words.map(word => <span key={word}>{word}</span>)}</div></article>)}
          </div>
          <div className="teacher-note"><b>🔎 けんきゅうの コツ</b><p>「つよい・よわい」「はやい・おそい」「みじかい・つづく」「どんな きもちに 見える」の 4つを 手がかりにすると、ことばの ちがいを 見つけやすいよ。</p></div>
          <button className="start-button compact" onClick={() => setScreen("level-select")}>もんだいに ちょうせん →</button>
        </section>
      )}
    </main>
  );
}
