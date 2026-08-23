// ============================================================
// ISHAMI — Migration: Add English translations to quiz questions
// Run: node migrateEnglish.js
// This adds questionEn and optionsEn to questions that don't have them
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

// ─── Translation Dictionary ────────────────────────────────
const RW_TO_EN = {
  // Questions
  "Ikinyabiziga cyose cyangwa ibinyabiziga bigenda bigomba kugira:":
    "Every vehicle or moving traffic must have:",
  "Ijambo 'akayira' bivuga inzira nyabagendwa ifunganye yagenewe gusa:":
    "The word 'lane' refers to a separate part of the road designated only for:",
  "Kunyuranaho bikorerwa:":
    "Overtaking is done:",
  "Ahatari mu nsisiro umuvuduko ntarengwa mu isaha wa velomoteri ni:":
    "Outside urban areas, the maximum speed per hour for motorcycles is:",
  "Uburyo bukoreshwa kugirango ikinyabiziga kigende gahoro igihe feri idakora neza babwita:":
    "The method used to slow down a vehicle when brakes fail is called:",
  "Nibura ikinyabiziga gitegetswe kugira uduhanagurakirahure tungahe:":
    "At minimum, a vehicle must have how many rearview mirrors:",
  "Amatara maremare y'ikinyabiziga agomba kuzimwa mu bihe bikurikira:":
    "Vehicle high beams must be turned off in the following situations:",
  "Ikinyabiziga nigishobora kugira amatara arenga abiri y'ubwoko bunwe keretse kubyerekeye amatara akurikira:":
    "A vehicle may have more than two lights of the same type except for:",
  "Ibinyabiziga bikurikira bigomba gukorerwa isuzumwa buri mwaka:":
    "The following vehicles must undergo inspection every year:",
  "Ubugari bwa romoruki ikuruwe n'ikinyamitende itatu ntibugomba kurenza ibipimo bikurikira:":
    "The width of a tricycle trolley must not exceed which measurement:",
  "Uburebure bw'ibinyabiziga bikurikira ntibugomba kurenga metero 11:":
    "The length of the following vehicles must not exceed 11 meters:",
  "Ikinyabiziga kibujjiwe guhagarara akanya kanini aha hakurikira:":
    "A vehicle is prohibited from stopping in the following places:",
  "Icyapa cyerekana umuvuduko ntarengwa ikinyabiziga kitagomba kurenza gishyirwa gusa ku binyabiziga bifite uburemere ntarengwa bukurikira:":
    "A sign showing maximum speed a vehicle must not exceed is placed only on vehicles with the following maximum weight:",
  "Iyo nta mategeko awugabanya by'umwihariko umuvuduko ntarengwa w'amapikipiki mu isaha ni:":
    "Unless otherwise regulated, the maximum speed for motorcycles per hour is:",
  "Ku byerekeye kwerekana ibinyabiziga n'ukumurika kwabyo ndetse no kwerekana ihindura ry'ibyerekezo byabyo. Birabujjiwe gukoresha andi matara cyangwa utugarurarumuri uretse ibitegetswe ariko ntibireba amatara akurikira:":
    "Regarding vehicle identification and direction indicators, it is forbidden to use other lights except:",
  "Ubugari bwa romoruki ikuruwe n'igare cyangwa velomoteri ntiburenza ibipimo bikurikira:":
    "The width of a sidecar attached to a motorcycle or bicycle must not exceed:",
  "Ibinyabiziga bikoreshwa nka tagisi, bitegerereza abantu mu nzira nyabagendwa, bishobora gushyirwaho itara ryerekana ko ikinyabiziga kitakodeshejwe. Iryo tara rishyirwaho ku buryo bukurikira:":
    "Vehicles used as taxis may display an 'unoccupied' sign. This sign is placed:",
  "Umuyobozi ugenda mu muhanda igihe ubugari bwawo budatuma anyuranaho nta nkomyi ashobora kunyura mu kayira k'abanyamaguru aruko amaze kureba ibi bikurikira:":
    "A driver whose vehicle width prevents overtaking without danger may enter a pedestrian lane only after checking:",
  "Umurongo uciyemo uduce umenyesha ahegereye umurongo ushobora kuzuzwa n'uturanga gukata tw'ibara ryera utwo turanga cyerekezo tumenyesha:":
    "The line consisting of short dashes indicates where the line can be crossed; these directional lines indicate:",
  "Ahantu ho kugendera mu muhanda herekanwa n'ibimenyetso bimurika ibinyabiziga ntibishobora kuhagenda:":
    "Where traffic on the road is indicated by traffic signs, vehicles must travel:",
  "Umuvuduko ntarengwa mu nsisiro:":
    "Maximum speed in urban areas:",
  "Umuvuduko ntarengwa ahataratuye:":
    "Maximum speed in rural areas:",

  // Options
  "Umuyobozi": "A driver",
  "Umuherekeza": "A passenger",
  "Abanyamaguru": "Pedestrians",
  "Ibinyabiziga bigendera ku biziga bibiri": "Two-wheeled vehicles",
  "A na B ni ibisubizo by'ukuri": "Both A and B are correct answers",
  "Nta gisubizo cy'ukuri kirimo": "None of the above is correct",
  "A na C nibyo": "Both A and C are correct",
  "Ibisubizo byose nibyo": "All of the above are correct",
  "Ibisubizo byose ni ukuri": "All of the above are true",
  "Ibi bisubizo byose ni ukuri": "All of these answers are correct",
  "Biteganye": "In single file",
  "Ku murongo umwe": "In single line",
  "Mu ruhande rw'iburyo gusa": "On the right side only",
  "Igihe cyose ni ibumoso": "Always on the left side",
  "Iburyo iyo unyura ku nyamaswa": "On the right when passing animals",
  "Ibinyabiziga bigenewe gutwara abagenzi muri rusange": "Vehicles designed to carry passengers",
  "Ibinyabiziga bigenewe gutwara ibintu birengeje toni 3.5": "Vehicles designed to carry goods exceeding 3.5 tons",
  "Ibinyabiziga bigenewe kwigisha gutwara": "Vehicles designed for driving instruction",
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
  "Feri y'urugendo": "Foot / service brake",
  "Feri yo guhagarara umwanya munini": "Parking brake",
  "Feri yo gutabara": "Emergency / engine braking",
  "cm75": "75 cm",
  "cm125": "125 cm",
  "cm265": "265 cm",
  "cm25": "25 cm",
  "cm45": "45 cm",
  "Metero 100": "100 meters",
  "Metero 200": "200 meters",
  "Metero 50": "50 meters",
  "Metero 150": "150 meters",
  "Ibifite umutambiko umwe uhuza imipira": "Those with a single axle connecting wheels",
  "Ibifite imitambiko ibiri ikurikiranye mu bugari bwayo": "Those with two axles following each other in width",
  "Makuzungu": "Trailers",
  "Amatara ndanga": "Running / position lights",
  "Amatara ari imbere mu modoka": "Lights at the front of the car",
  "Amatara ndangaburumbarare": "Fog lights",
  "Itara ndangamubyimba": "Headlights",
  "Itara ryerekana icyerekezo": "Turn signal indicators",
  "Itara ndangaburumbarare": "Fog lights",
  "Iyo ikinyabiziga kigiye kubisikana n'ibindi": "When the vehicle is about to meet another vehicle",
  "Iyo unuhanda umurikiye umuyobozi abasha kureba muri metero 20": "When the road is lit and the driver can see 20 meters ahead",
  "Iyo ari mu nsisiro": "When in urban areas",
  "1": "1",
  "2": "2",
  "3": "3",
  "Ubururu": "Blue",
  "Umweru": "White",
  "Umukara": "Black",
  "Ikirango ni umweru n'umukara": "The border is white and black",
  "Ibyapa bibuza n'ibitegeka": "Warning signs and mandatory signs",
  "Toni 16": "16 tons",
  "Toni 24": "24 tons",
  "Ahatarengeje metero 1 imbere cyangwa inyuma y'ikinyabiziga gihagaze akanya gato cyangwa kanini": "Within 1 meter in front of or behind a vehicle stopped briefly or for a long time",
  "Ahantu hatari ibimenyetso bibuza byabugenewe": "Places without specific prohibition signs",
  "Aho abanyamaguru banyura mu muhanda ngo bakikire inkomyi": "Where pedestrians cross the road to reach islands",
  "Ipikipiki ifite akanyabiziga kometse ku ruhande rwayo": "A motorcycle with a sidecar attached to its side",
  "Inyaka 12": "12 years",
  "Ahanyurwa n'ibinyamitende": "Where bicycles pass",
  "Kugirango birusheho kugaragara neza": "So that they can be clearly seen",
  "Ni itara ry'icyatsi rishyirwa imbere ku kinyabiziga": "As a green light at the front of the vehicle",
  "Ni itara ry'icyatsi rishyirwa ibumoso": "As a green light on the left",
  "Ni itara ry'umuhondo rishyirwa inyuma": "As a yellow light at the rear",
  "Umuvuduko w'abanyamaguru": "Speed of pedestrians",
  "Ubugari bw'umuhanda": "Width of the road",
  "Umubare w'abanyamaguru": "Number of pedestrians",
};

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('[Migrate] Connected to MongoDB');

    const questions = await Question.find({}).lean();
    console.log(`[Migrate] Found ${questions.length} questions`);

    let updated = 0;
    let skipped = 0;

    for (const q of questions) {
      // Skip if already has English
      if (q.questionEn && q.questionEn.trim() && q.optionsEn && q.optionsEn.length > 0) {
        skipped++;
        continue;
      }

      const questionEn = RW_TO_EN[q.question] || '';
      let optionsEn = [];

      for (const opt of (q.options || [])) {
        const en = RW_TO_EN[opt.text] || opt.text;
        optionsEn.push({ text: en, isCorrect: opt.isCorrect });
      }

      if (questionEn || optionsEn.some(o => RW_TO_EN[q.options?.find(orig => orig.isCorrect)?.text])) {
        await Question.findByIdAndUpdate(q._id, {
          ...(questionEn ? { questionEn } : {}),
          ...(optionsEn.length > 0 ? { optionsEn } : {})
        });
        updated++;
        console.log(`[Migrate] Updated: ${questionEn.substring(0, 50) || q.question.substring(0, 50)}...`);
      } else {
        skipped++;
      }
    }

    console.log(`\n[Migrate] Done! Updated: ${updated}, Skipped (already translated): ${skipped}`);
    process.exit(0);
  } catch (e) {
    console.error('[Migrate] Error:', e.message);
    process.exit(1);
  }
}

migrate();
