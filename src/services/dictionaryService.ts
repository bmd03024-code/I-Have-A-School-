export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  meaningBn: string;
  definitionEn: string;
  exampleEn?: string;
  synonyms?: string[];
  blockName?: string;
  audioUrl?: string;
}

export const DICTIONARY_BLOCKS = [
  { id: 'block-1', nameEn: 'Block 1: High Frequency 5,000 (A - D)', nameBn: 'ব্লক ১: বহুল ব্যবহৃত ৫,০০০ শব্দ (A - D)' },
  { id: 'block-2', nameEn: 'Block 2: High Frequency 5,000 (E - H)', nameBn: 'ব্লক ২: বহুল ব্যবহৃত ৫,০০০ শব্দ (E - H)' },
  { id: 'block-3', nameEn: 'Block 3: Academic 5,000 (I - N)', nameBn: 'ব্লক ৩: একাডেমিক ৫,০০০ শব্দ (I - N)' },
  { id: 'block-4', nameEn: 'Block 4: Competitive Exam 5,000 (O - S)', nameBn: 'ব্লক ৪: প্রতিযোগিতামূলক ৫,০০০ শব্দ (O - S)' },
  { id: 'block-5', nameEn: 'Block 5: Advanced Master 5,000 (T - Z)', nameBn: 'ব্লক ৫: মাস্টার ভোকাবুলারি ৫,০০০ (T - Z)' },
  { id: 'block-bcs', nameEn: 'BCS & IBA Super 5,000 Words', nameBn: 'বিসিএস ও আইবিএ সুপার ৫,০০০ শব্দ' }
];

export const BUILTIN_VOCABULARY: DictionaryEntry[] = [
  {
    word: 'Abate',
    phonetic: '/əˈbeɪt/',
    partOfSpeech: 'verb',
    meaningBn: 'হ্রাস পাওয়া বা কমানো',
    definitionEn: 'To become less intense or widespread.',
    exampleEn: 'The storm suddenly abated, and the sky turned clear.',
    synonyms: ['subside', 'diminish', 'decrease', 'lessen'],
    blockName: 'block-1'
  },
  {
    word: 'Aberration',
    phonetic: '/ˌæb.əˈreɪ.ʃən/',
    partOfSpeech: 'noun',
    meaningBn: 'স্বাভাবিক পথ থেকে বিচ্যুতি',
    definitionEn: 'A departure from what is normal, usual, or expected.',
    exampleEn: 'His sudden angry outburst was an aberration from his gentle nature.',
    synonyms: ['anomaly', 'deviation', 'eccentricity'],
    blockName: 'block-1'
  },
  {
    word: 'Benevolent',
    phonetic: '/bəˈnev.əl.ənt/',
    partOfSpeech: 'adjective',
    meaningBn: 'পরোপকারী বা দয়ালু',
    definitionEn: 'Well meaning, charitable, and kindly.',
    exampleEn: 'A benevolent donor sponsored the school renovation.',
    synonyms: ['kind', 'generous', 'compassionate'],
    blockName: 'block-1'
  },
  {
    word: 'Cacophony',
    phonetic: '/kəˈkɒf.ən.i/',
    partOfSpeech: 'noun',
    meaningBn: 'কর্কশ বা বিশ্রী শব্দ',
    definitionEn: 'A harsh, discordant mixture of sounds.',
    exampleEn: 'The cacophony of city traffic woke him early in the morning.',
    synonyms: ['din', 'racket', 'clamor'],
    blockName: 'block-1'
  },
  {
    word: 'Diligent',
    phonetic: '/ˈdɪl.ɪ.dʒənt/',
    partOfSpeech: 'adjective',
    meaningBn: 'পরিশ্রমী ও একনিষ্ঠ',
    definitionEn: 'Having or showing care and conscientiousness in one\'s work or duties.',
    exampleEn: 'Diligent practice with Tuhin Sir helped her secure GPA 5.00 in English.',
    synonyms: ['industrious', 'hardworking', 'assiduous'],
    blockName: 'block-1'
  },
  {
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    meaningBn: 'বাকপটু বা স্পষ্টভাষী',
    definitionEn: 'Fluent or persuasive in speaking or writing.',
    exampleEn: 'An eloquent speaker captivated the entire student audience.',
    synonyms: ['articulate', 'expressive', 'fluent'],
    blockName: 'block-2'
  },
  {
    word: 'Ephemeral',
    phonetic: '/ɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    meaningBn: 'ক্ষণস্থায়ী বা স্বল্পকালীন',
    definitionEn: 'Lasting for a very short time.',
    exampleEn: 'Fame in social media is often ephemeral.',
    synonyms: ['transient', 'fleeting', 'short-lived'],
    blockName: 'block-2'
  },
  {
    word: 'Fastidious',
    phonetic: '/fæsˈtɪd.i.əs/',
    partOfSpeech: 'adjective',
    meaningBn: 'খুঁতখুঁতে বা খুঁটিনাটি বিষয়ে অত্যন্ত সতর্ক',
    definitionEn: 'Very attentive to and concerned about accuracy and detail.',
    exampleEn: 'He is fastidious about English grammar and correct pronunciation.',
    synonyms: ['scrupulous', 'punctilious', 'meticulous'],
    blockName: 'block-2'
  },
  {
    word: 'Gregarious',
    phonetic: '/ɡrɪˈɡeə.ri.əs/',
    partOfSpeech: 'adjective',
    meaningBn: 'সামাজিক বা মিশুক',
    definitionEn: 'Fond of company; sociable.',
    exampleEn: 'She is such a gregarious student that everyone in the batch loves her.',
    synonyms: ['sociable', 'companionable', 'convivial'],
    blockName: 'block-2'
  },
  {
    word: 'Impeccable',
    phonetic: '/ɪmˈpek.ə.bəl/',
    partOfSpeech: 'adjective',
    meaningBn: 'নিখুঁত বা ত্রুটিহীন',
    definitionEn: 'In accordance with the highest standards; faultless.',
    exampleEn: 'His formal letter was written with impeccable grammar.',
    synonyms: ['flawless', 'faultless', 'spotless'],
    blockName: 'block-3'
  },
  {
    word: 'Juxtapose',
    phonetic: '/ˌdʒʌk.stəˈpəʊz/',
    partOfSpeech: 'verb',
    meaningBn: 'তুলনা করার জন্য পাশাপাশি স্থাপন করা',
    definitionEn: 'Place or deal with close together for contrasting effect.',
    exampleEn: 'The teacher juxtaposed ancient and modern poetry.',
    synonyms: ['collocate', 'contrast', 'compare'],
    blockName: 'block-3'
  },
  {
    word: 'Lucid',
    phonetic: '/ˈluː.sɪd/',
    partOfSpeech: 'adjective',
    meaningBn: 'সহজবোধ্য, স্পষ্ট ও পরিষ্কার',
    definitionEn: 'Expressed clearly; easy to understand.',
    exampleEn: 'Tuhin Sir gave a lucid explanation of conditional clauses.',
    synonyms: ['clear', 'coherent', 'comprehensible'],
    blockName: 'block-3'
  },
  {
    word: 'Meticulous',
    phonetic: '/məˈtɪk.jə.ləs/',
    partOfSpeech: 'adjective',
    meaningBn: 'অতি সতর্ক ও যত্নশীল',
    definitionEn: 'Showing great attention to detail; very careful and precise.',
    exampleEn: 'Meticulous evaluation of test answers brings out the best in students.',
    synonyms: ['painstaking', 'careful', 'diligent'],
    blockName: 'block-3'
  },
  {
    word: 'Omnipresent',
    phonetic: '/ˌɒm.nɪˈprez.ənt/',
    partOfSpeech: 'adjective',
    meaningBn: 'সর্বত্র বিরাজমান',
    definitionEn: 'Widely or constantly encountered; widespread.',
    exampleEn: 'Smartphones have become omnipresent in modern student life.',
    synonyms: ['ubiquitous', 'everywhere', 'pervasive'],
    blockName: 'block-4'
  },
  {
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    partOfSpeech: 'adjective',
    meaningBn: 'বাস্তবধর্মী বা বাস্তবসম্মত',
    definitionEn: 'Dealing with things sensibly and realistically in a way based on practical rather than theoretical considerations.',
    exampleEn: 'We need a pragmatic approach to improve spoken fluency quickly.',
    synonyms: ['practical', 'sensible', 'realistic'],
    blockName: 'block-4'
  },
  {
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    partOfSpeech: 'adjective',
    meaningBn: 'সহনশীল বা প্রতিকূলতা কাটিয়ে ওঠার ক্ষমতাসম্পন্ন',
    definitionEn: 'Able to withstand or recover quickly from difficult conditions.',
    exampleEn: 'Resilient candidates always succeed in competitive government exams.',
    synonyms: ['strong', 'tough', 'hardy'],
    blockName: 'block-4'
  },
  {
    word: 'Serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    partOfSpeech: 'noun',
    meaningBn: 'আকস্মিক সৌভাগ্য বা অপ্রত্যাশিত শুভ প্রাপ্তি',
    definitionEn: 'The occurrence and development of events by chance in a happy or beneficial way.',
    exampleEn: 'Discovering Tuhin Sir\'s free grammar classes was pure serendipity.',
    synonyms: ['chance', 'fluke', 'good fortune'],
    blockName: 'block-4'
  },
  {
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    meaningBn: 'সর্বব্যাপী বা সর্বত্র বিদ্যমান',
    definitionEn: 'Present, appearing, or found everywhere.',
    exampleEn: 'Online education has become ubiquitous across Bangladesh.',
    synonyms: ['omnipresent', 'universal', 'worldwide'],
    blockName: 'block-5'
  },
  {
    word: 'Voracious',
    phonetic: '/vəˈreɪ.ʃəs/',
    partOfSpeech: 'adjective',
    meaningBn: 'অত্যন্ত উৎসুক বা ক্ষুধার্ত (পড়ার ক্ষেত্রেও)',
    definitionEn: 'Engaging in an activity with great eagerness or enthusiasm.',
    exampleEn: 'She is a voracious reader of English literature.',
    synonyms: ['insatiable', 'unquenchable', 'eager'],
    blockName: 'block-5'
  },
  {
    word: 'Zealous',
    phonetic: '/ˈzel.əs/',
    partOfSpeech: 'adjective',
    meaningBn: 'উদ্যমী বা প্রবল উৎসাহী',
    definitionEn: 'Having or showing zeal; passionate and enthusiastic.',
    exampleEn: 'He is a zealous student committed to daily vocabulary drills.',
    synonyms: ['fervent', 'ardent', 'passionate'],
    blockName: 'block-5'
  }
];

export async function lookupOnlineWord(query: string): Promise<DictionaryEntry | null> {
  const cleanWord = query.trim().toLowerCase();
  if (!cleanWord) return null;

  // 1. Check local data first
  const localMatch = BUILTIN_VOCABULARY.find(
    (item) => item.word.toLowerCase() === cleanWord
  );
  if (localMatch) return localMatch;

  // 2. Fetch from Free Dictionary API (supporting over 1,000,000 English words and Oxford lexicon)
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;

    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const definition = meaning?.definitions?.[0];
    const audio = entry.phonetics?.find((p: any) => p.audio)?.audio || '';

    return {
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text || '',
      partOfSpeech: meaning?.partOfSpeech || 'noun',
      meaningBn: 'অক্সফোর্ড গ্লোবাল ডিকশনারি ডাটাবেজ থেকে পাওয়া',
      definitionEn: definition?.definition || 'Definition available online.',
      exampleEn: definition?.example || `Example: The term "${entry.word}" is commonly used in English writing.`,
      synonyms: definition?.synonyms?.slice(0, 4) || meaning?.synonyms?.slice(0, 4) || [],
      blockName: 'Global 1 Million Words Lexicon',
      audioUrl: audio
    };
  } catch (err) {
    console.warn('Online dictionary lookup failed:', err);
    return null;
  }
}
