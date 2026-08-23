// ============================================================
// ISHAMI — Quiz Question English Translation Script
// Run: node translateQuestions.js
// Adds questionEn and optionsEn to questions that are missing them
// ============================================================

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.3tglbwn.mongodb.net/?appName=Cluster0';
const MONGODB_DB = process.env.MONGODB_DB || 'ishami';

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Types.ObjectId, ref: 'Quiz' },
  category: String,
  question: String,
  questionEn: { type: String, default: '' },
  options: [{ text: String, isCorrect: Boolean }],
  optionsEn: [{ text: String, isCorrect: Boolean }],
  licenseClass: { type: [String], default: ['A','B','C','D'] },
  image: { type: String, default: null }
});
const Question = mongoose.model('Question', QuestionSchema);

// ─── Translation Map ──────────────────────────────────────
// Maps Kinyarwanda question text to English translation
const TRANSLATIONS = {
  // General traffic rules
  "Ikinyabiziga cyose cyangwa ibinyabiziga bigenda bigomba kugira:":
    "Every vehicle or moving traffic must have:",
  "Ijambo 'akayira' bivuga inzira nyabagendwa ifunganye yagenewe gusa:":
    "The word 'lane' refers to a separate part of the road designated only for:",
  "Kunyuranaho bikorerwa:":
    "Overtaking is done:",
  "Ibisubizo byose nibyo":
    "All of the above are correct",
  "Nta gisubizo cy'ukuri kirimo":
    "None of the above is correct",
  "A na B ni ibisubizo by'ukuri":
    "Both A and B are correct answers",
  "A na C nibyo":
    "Both A and C are correct",
  "Ibisubizo byose ni ukuri":
    "All of the above are true",
  "Ibi bisubizo byose ni ukuri":
    "All of these answers are correct",
  "Umuyobozi": "A driver",
  "Umuherekeza": "A passenger",
  "Abanyamaguru": "Pedestrians",
  "Ibinyabiziga bigendera ku biziga bibiri": "Two-wheeled vehicles",
  "Biteganye": "In single file",
  "Ku murongo umwe": "In single file",
  "Mu ruhande rw'iburyo gusa": "On the right side only",
  "Igihe cyose ni ibumoso": "Always on the left side",
  "Iburyo iyo unyura ku nyamaswa": "On the right when passing animals",

  // Vehicle types
  "Ibinyabiziga bigenewe gutwara abagenzi muri rusange":
    "Vehicles designed to carry passengers",
  "Ibinyabiziga bigenewe gutwara ibintu birengeje toni 3.5":
    "Vehicles designed to carry goods exceeding 3.5 tons",
  "Ibinyabiziga bigenewe kwigisha gutwara":
    "Vehicles designed for driving instruction",

  // Speed limits
  "Burenga toni 1": "Over 1 ton",
  "Burenga toni 2": "Over 2 tons",
  "Burenga toni 24": "Over 24 tons",
  "Burenga toni 12": "Over 12 tons",
  "Km50": "50 km/h",
  "Km40": "40 km/h",
  "Km30": "30 km/h",
  "Km25": "25 km/h",
  "Km70": "70 km/h",
  "Km 60 mu isaha": "60 km per hour",
  "Km 75 mu isaha": "75 km per hour",
  "Km20 mu isaha": "20 km per hour",

  // Brakes
  "Feri y'urugendo": "Foot / service brake",
  "Feri yo guhagarara umwanya munini": "Parking brake",
  "Feri yo gutabara": "Emergency / engine braking",

  // Vehicle dimensions
  "cm75": "75 cm",
  "cm125": "125 cm",
  "cm265": "265 cm",
  "cm25": "25 cm",
  "cm45": "45 cm",
  "Metero 100": "100 meters",
  "Metero 200": "200 meters",
  "Metero 50": "50 meters",
  "Metero 150": "150 meters",

  // Colors
  "Ubururu": "Blue",
  "Umweru": "White",
  "Umukara": "Black",
  "Ikirango ni umweru n'umukara": "The border is white and black",

  // Signs
  "Ibyapa bibuza n'ibitegeka": "Warning signs and mandatory signs",

  // Weight limits
  "Toni 16": "16 tons",
  "Toni 24": "24 tons",

  // Vehicle features
  "Ibifite umutambiko umwe uhuza imipira": "Those with a single axle connecting wheels",
  "Ibifite imitambiko ibiri ikurikiranye mu bugari bwayo": "Those with two axles following each other in width",
  "Makuzungu": "Trailers",

  // Stopping
  "Ahatarengeje metero 1 imbere cyangwa inyuma y'ikinyabiziga gihagaze akanya gato cyangwa kanini":
    "Within 1 meter in front of or behind a vehicle stopped briefly or for a long time",
  "Ahantu hatari ibimenyetso bibuza byabugenewe":
    "Places without specific prohibition signs",
  "Aho abanyamaguru banyura mu muhanda ngo bakikire inkomyi":
    "Where pedestrians cross the road to reach islands",

  // Motorcycle types
  "Ahatari mu nsisiro umuvuduko ntarengwa mu isaha wa velomoteri ni:":
    "Outside urban areas, the maximum speed per hour for motorcycles is:",
  "Ipikipiki ifite akanyabiziga kometse ku ruhande rwayo":
    "A motorcycle with a sidecar attached to its side",

  // Age limits
  "Inyaka 12": "12 years",

  // Vehicle lights
  "Amatara ndanga": "Running / position lights",
  "Amatara ari imbere mu modoka": "Lights located at the front of the car",
  "Amatara ndangaburambarare": "Fog lights",

  // Vehicle inspection
  "Ahanyurwa n'ibinyamitende": "Where bicycles pass",

  // Vehicle capacity
  "Kugirango birusheho kugaragara neza": "So that they can be clearly seen",

  // Age for vehicle inspection
  "Ikinyabiziga kibujjiwe guhagarara akanya kanini aha hakurikira:":
    "A vehicle is prohibited from stopping in the following places:",
};

// ─── English Options Map ──────────────────────────────────
// Maps full Kinyarwanda question + options to English options
const OPTIONS_TRANSLATIONS = {
  // Question about vehicle requirements
  "Umuyobozi|Umuherekeza|A na B ni ibisubizo by'ukuri|Nta gisubizo cy'ukuri kirimo":
    "A driver|A passenger|Both A and B are correct answers|None of the above is correct",

  // Question about lanes
  "Abanyamaguru|Ibinyabiziga bigendera ku biziga bibiri|A na B ni ibisubizo by'ukuri|Nta gisubizo cy'ukuri kirimo":
    "Pedestrians|Two-wheeled vehicles|Both A and B are correct answers|None of the above is correct",

  // Question about overtaking
  "Mu ruhande rw'iburyo gusa|Igihe cyose ni ibumoso|Iburyo iyo unyura ku nyamaswa|Nta gisubizo cy'ukuri kirimo":
    "On the right side only|Always on the left side|On the right when passing animals|None of the above is correct",

  // Question about speed signs
  "Burenga toni 1|Burenga toni 2|Burenga toni 24|Nta gisubizo cy'ukuri kirimo":
    "Over 1 ton|Over 2 tons|Over 24 tons|None of the above is correct",

  // Question about motorcycle speed outside urban
  "Km50|Km40|Km30|Nta gisubizo cy'ukuri":
    "50 km/h|40 km/h|30 km/h|None of the above is correct",

  // Question about brakes
  "Feri y'urugendo|Feri yo guhagarara umwanya munini|Feri yo gutabara|Nta gisubizo cy'ukuri kirimo":
    "Foot / service brake|Parking brake|Emergency / engine braking|None of the above is correct",

  // Question about mirrors
  "Ibinyabiziga bigenewe gutwara abagenzi muri rusange|Ibinyabiziga bigenewe gutwara ibintu birengeje toni 3.5|Ibinyabiziga bigenewe kwigisha gutwara|Nta gisubizo cy'ukuri kirimo":
    "Vehicles designed to carry passengers|Vehicles designed to carry goods exceeding 3.5 tons|Vehicles designed for driving instruction|None of the above is correct",

  // Question about tricycle width
  "cm75|cm125|cm265|Nta gisubizo cy'ukuri":
    "75 cm|125 cm|265 cm|None of the above is correct",

  // Question about vehicle length
  "Ibifite umutambiko umwe uhuza imipira|Ibifite imitambiko ibiri ikurikiranye mu bugari bwayo|Makuzungu|Nta gisubizo cy'ukuri":
    "Those with a single axle connecting wheels|Those with two axles following each other in width|Trailers|None of the above is correct",

  // Question about stopping places
  "Ahatarengeje metero 1 imbere cyangwa inyuma y'ikinyabiziga gihagaze akanya gato cyangwa kanini|Ahantu hatari ibimenyetso bibuza byabugenewe|Aho abanyamaguru banyura mu muhanda ngo bakikire inkomyi|Ibisubizo byose nibyo":
    "Within 1 meter in front of or behind a vehicle stopped briefly or for a long time|Places without specific prohibition signs|Where pedestrians cross the road to reach islands|All of the above are correct",

  // Question about vehicle lights
  "Amatara ndanga|Amatara ari imbere mu modoka|Amatara ndangaburambarare|Ibisubizo byose nibyo":
    "Running / position lights|Lights located at the front of the car|Fog lights|All of the above are correct",

  // Question about motorcycle sidecar
  "Ipikipiki ifite akanyabiziga kometse ku ruhande rwayo":
    "A motorcycle with a sidecar attached to its side",
};

async function translateQuestions() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('[Translate] Connected to MongoDB');

    const questions = await Question.find({}).lean();
    console.log(`[Translate] Found ${questions.length} questions total`);

    let updated = 0;
    let skipped = 0;

    for (const q of questions) {
      // Skip if already has English translations
      if (q.questionEn && q.questionEn.trim() && q.optionsEn && q.optionsEn.length > 0) {
        skipped++;
        continue;
      }

      // Try to find translation for the question
      let questionEn = TRANSLATIONS[q.question] || '';
      let optionsEn = [];

      // Try to find options translation
      const optionsKey = (q.options || []).map(o => o.text).join('|');
      if (OPTIONS_TRANSLATIONS[optionsKey]) {
        const enTexts = OPTIONS_TRANSLATIONS[optionsKey].split('|');
        optionsEn = q.options.map((opt, i) => ({
          text: enTexts[i] || opt.text,
          isCorrect: opt.isCorrect
        }));
      } else {
        // Fallback: try to translate individual option texts
        optionsEn = q.options.map(opt => ({
          text: TRANSLATIONS[opt.text] || opt.text,
          isCorrect: opt.isCorrect
        }));
      }

      // If we found at least a question translation, update
      if (questionEn) {
        await Question.findByIdAndUpdate(q._id, {
          questionEn,
          optionsEn
        });
        updated++;
        console.log(`[Translate] Updated: ${questionEn.substring(0, 60)}...`);
      } else {
        // Still update options even if question translation not found
        if (optionsEn.length > 0 && optionsEn.some(o => o.text !== q.options.find(orig => orig.text === o.text)?.text)) {
          await Question.findByIdAndUpdate(q._id, { optionsEn });
          updated++;
          console.log(`[Translate] Updated options only for: ${q.question.substring(0, 60)}...`);
        } else {
          skipped++;
          console.log(`[Translate] Skipped (no translation): ${q.question.substring(0, 60)}...`);
        }
      }
    }

    console.log(`\n[Translate] Done! Updated: ${updated}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (e) {
    console.error('[Translate] Error:', e.message);
    process.exit(1);
  }
}

translateQuestions();
