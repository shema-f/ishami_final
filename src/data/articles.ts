// Blog/Articles Data — Bilingual (English + Kinyarwanda)
// ISHAMI Platform Articles & Ferrivox Ltd

export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface ArticleSEO {
  metaTitle?: string;
  metaTitleRw?: string;
  metaDescription?: string;
  metaDescriptionRw?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface Article {
  id: string;
  slug: string;
  title_en: string;
  title_rw: string;
  excerpt_en: string;
  excerpt_rw: string;
  content_en: string;
  content_rw: string;
  image: string;
  category: string;
  category_rw: string;
  readTime: string;
  date: string;
  author: string;
  status: ArticleStatus;
  publishDate?: string;
  seo?: ArticleSEO;
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'complete-guide-driving-rwanda',
    title_en: 'Complete Guide to Driving in Rwanda: Rules, Licensing, and Safety',
    title_rw: 'Amabwiriza n\'Ubuhanga bwo Gutwara Ibinyabiziga mu Rwanda',
    excerpt_en: 'Driving in Rwanda requires a firm grasp of traffic regulations, digital enforcement systems, and terrain-specific driving techniques. This guide outlines everything you need to know.',
    excerpt_rw: 'Gutwara ikinyabiziga mu Rwanda bisaba gusobanukirwa neza amategeko y\'umuhanda, uburyo ikoranabuhanga rikoreshwa mu kubungabunga umutekano, ndetse n\'ubuhanga bwo gutwara mu misozi.',
    content_en: `## Core Traffic Regulations & Road Signs

Rwanda uses standard international road signs featuring universal symbols and clear text. Disregarding road signs can result in on-the-spot or camera-issued fines starting at 10,000 RWF.

### Speed Limits
- **Urban & Built-up Areas:** 40 km/h (reduced near school zones and heavy pedestrian corridors)
- **Rural Roads & Highways:** 60 km/h to 80 km/h, depending on posted signs

### Lane Discipline & Overtaking
Traffic moves on the right. Overtake strictly on the left. Passing on solid white lines or around sharp blind curves is illegal.

### Roundabouts
Vehicles already circulating inside the roundabout maintain strict right-of-way. Yield before entering and indicate your exit lane early.

### Pedestrian Priority
Drivers must yield to pedestrians at all marked zebra crossings. Stop fully if a pedestrian is waiting at the curb.

### Parking Rules
Parking in designated "No Parking" zones, bus lanes, or near emergency exits is strictly forbidden. Exceeding brief drop-off limits (over 5 minutes) risks immediate towing and heavy fines.

## Licensing Process via IremboGov

Acquiring a driving license in Rwanda is a fully digitized, two-stage procedure managed through IremboGov (www.irembo.gov.rw or *909#).

| Stage | Requirements | Min Pass Score | Validity |
|-------|-------------|----------------|----------|
| Provisional License | National ID, test registration code, phone number, and email | 60% (Busanza) / 12/20 (other) | 1 Year |
| Definitive License | Valid e-Provisional license, practical driving test certificate | Pass practical exam | Multi-Year |

### Application Steps:
1. Log in to IremboGov, navigate to the Police section
2. Enter your registration exam code
3. Select your preferred collection station
4. Pay the statutory fee using the generated billing ID
5. Download your digital license or await SMS notification

## Traffic Violations & Fines

Rwanda operates a continuous 24/7 digital monitoring network powered by speed cameras, red-light cameras, and mobile hand-held police devices.

- **Digital Notifications:** Camera-detected violations trigger automated SMS notices
- **Payment Deadline:** Fines must be cleared within 3 days via IremboGov
- **Zero-Tolerance DUI:** Drunk driving laws carry zero tolerance
- **Demerit Point System:** Violations deduct points from your driving profile

## Safe Driving in Rwanda's Terrain

Rwanda's rolling hills and seasonal rains require deliberate vehicle handling.

- **Hill Driving:** Downshift to lower gears when ascending. Use engine braking when descending.
- **Rainy Seasons:** Expand following distance from 3 to 4–5 seconds
- **Night Driving:** Switch to low beams when encountering oncoming vehicles
- **Fuel Economy:** Maintain smooth acceleration between 70–85 km/h`,
    content_rw: `## Amategeko y'Umuhanda n'Ibyapa by'Ingenzi

Ibyapa n'ibimenyetso byo mu muhanda mu Rwanda byubahiriza amahame mpuzamahanga. Kurenga ku byapa bishobora kugukururira ihazabu itangirira ku mafaranga 10,000 RWF.

### Umuvuduko Wemewe
- **Mu mijyi no mu nsisiro:** Nturenze 40 km/h (ugabanuka cyane ku mashuri n'ahanyura abanyamaguru benshi)
- **Mu mihanda yo hanze y'umujyi na gariyandiko:** 60 km/h kugeza kuri 80 km/h bitewe n'ibyapa bihari

### Uruhande rwo Kugenderamo no Kunyuranaho
Ibinyabiziga bigendera iburyo. Kunyuranaho bikorerwa ibumoso gusa. Birabujijwe rwose guca ku murongo wera ukomeje cyangwa mu makorosi atabona neza.

### Uburyo bwo Kuzenguruka Rond-Point
Ikinyabiziga kiri muri rond-point nicyo gifite uburenganzira bwo gutambuka mbere. Tegereza umuhanda uboneke neza mbere yo kwinjiramo.

### Umutekano w'Abanyamaguru
Abanyamaguru bafite uburenganzira bwa mbere ku mirongo yera yabagenewe. Hagarara neza igihe cyose umunyamaguru ateganya kwambuka.

### Guhagarara no Guhagarika Ikinyabiziga
Birabujijwe guhagarara aho ibyapa bibibuza, mu mayira y'imodoka zitwara abagenzi, cyangwa imbere y'inzira z'ubutabazi.

## Uburyo bwo Gusaba Uruhushya rwo Gutwara Ibinyabiziga kuri IremboGov

Gushaka uruhushya rwo gutwara ikinyabiziga bikorerwa ku rubuga rwa IremboGov (www.irembo.gov.rw cyangwa gukanda *909#).

### Intambwe zo gusaba:
1. Injira kuri IremboGov, hitamo serivisi za Poliisi
2. Shyiramo kode yawe y'ikizamini
3. Hitamo sitasiyo ya polisi yoroshye kuzahiraho uruhushya rwawe
4. Ishyura ukoresheje kode y'ubwishyu
5. Kura kopi y'uruhushya kuri konte yawe cyangwa utegereze SMS

## Amakosa yo mu Muhanda n'Ibihano

Umutekano wo mu muhanda ucungwa hifashishijwe kamera z'umuvuduko, kamera zo mu masangano y'imihanda, n'utwuma tw'ikoranabuhanga.

- **Ubutumwa bw'Ihazabu:** Iyo kamera igufashe, uhita wohererezwa SMS
- **Igihe cyo Kwishyura:** Ihazabu igomba kwishyurwa mu minsi 3
- **Ubusinzi mu Muhanda:** Gutwara wasinze birabujijwe rwose
- **Sisitemu yo Gukata Amanota:** Amakosa agenda agabanya amanota ku ruhushya

## Inama zo Gutwara Neza mu Misozi

Imiterere y'imisozi y'u Rwanda n'imvura igwa mu bihe bitandukanye bisaba ubuhanga bwihariye.

- **Kumanuka no Kuzamuka:** Koresha vitesi ntoya. Koresha feri ya moteri kumanuka.
- **Ibihe by'Imvura:** Ongerera intera kuri masegonda 4–5
- **Kugenda Nijoro:** Zimya amatara maremare igihe uhuye n'ikindi kinyabiziga
- **Kuzigama Ibitoro:** Gabanya umuvuduko ukabije, shyiramo umwuka ukwiye mu mapine`,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
    category: 'Driving Guide',
    category_rw: "Amabwiriza yo Gutwara",
    readTime: '10 min read',
    date: '2025-01-15',
    author: 'ISHAMI Team',
    status: 'published',
  },
  {
    id: '2',
    slug: 'understanding-rwanda-road-signs',
    title_en: 'Understanding Rwanda Road Signs: A Complete Visual Guide',
    title_rw: 'Kumenya Ibyapa by\'Umuhanda mu Rwanda: Amategeko yose',
    excerpt_en: 'Learn to identify and understand all road signs used in Rwanda — from warning signs to mandatory instructions and information markers.',
    excerpt_rw: 'Menya ukumenya no gusobanukirwa ibyapa vyose bisanzwe mu Rwanda — ukuyobora, kumenyesha, n\'ibimenyetso.',
    content_en: `## Types of Road Signs in Rwanda

Rwanda follows the Vienna Convention on Road Signs and Signals. Here are the main categories:

### Warning Signs (Triangle — Red Border)
- **Pedestrian Crossing:** Triangle with walking figure
- **School Zone:** Triangle with children figures
- **Roundabout Ahead:** Triangle with circular arrows
- **Sharp Curve:** Triangle with curved arrow
- **Steep Hill:** Triangle with slope symbol

### Prohibition Signs (Circle — Red Border)
- **Speed Limit:** Circle with number (e.g., 50 = max 50 km/h)
- **No Overtaking:** Circle with two cars, one red
- **No Entry:** Red circle with white horizontal line
- **No Parking:** Blue circle with red X
- **No Stopping:** Blue circle with red cross

### Mandatory Signs (Circle — Blue)
- **Turn Right/Left:** Blue circle with white arrow
- **Go Straight:** Blue circle with upward arrow
- **Minimum Speed:** Blue circle with white number

### Information Signs (Rectangular)
- **Direction Signs:** Green for highways, blue for local roads
- **Distance Markers:** White rectangles with km numbers
- **Tourist Information:** Brown rectangles with attractions

### Road Markings
- **Solid White Line:** Do not cross
- **Broken White Line:** May cross when safe
- **Double Solid Lines:** No crossing in either direction
- **Zebra Crossing:** Pedestrian priority zone
- **Stop Line:** Must stop before this line at red light`,
    content_rw: `## Ibicucu by'Ibyapa byo mu Muhanda mu Rwanda

Rwanda yubahiriza Iparamiyamo ya Vienna ku Bbyapa byo mu Muhanda n'Ibimenyetso. Dr. ibicucu bikuru ni ibi:

### Ibyapa byo Kumenya (Mpandeshatu — Umubiri wtuku)
- **Abanyamaguru Bambuka:** Mpandeshatu ifite umuntu usendersa
- **Ahantu h'Ashuri:** Mpandeshatu ifite abana
- **Rond-Point:** Mpandeshatu ifite akamere ko kuzenguruka
- **Imfuruka:** Mpandeshatu ifite akamere ko kugenda
- **Musozi Muremure:** Mpandeshatu ifite ibara ry'umusozi

### Ibyapa byo Kubuza (Urubibi — Umubiri wtuku)
- **Umuvuduko Ntarengwa:** Urubibi rifite inamba (urugero: 50 = ntarenze 50 km/h)
- **Ntukinyuranaho:** Urubibi rifite imodoka ebyiri, imwe ituku
- **Ntwinjire:** Utuku burubibi rifite umweru uterekeye
- **Ntuhagare:** Uburubiri bw'uburera rifite akamere ko tuku
- **Ntuhagare na gato:** Uburubiri bw'uburera rifite akamere ko tuku

### Ibyo Kwemera (Urubibi — Umubera)
- **Kuzenguruka Iburyo/Ibumoso:** Urubibi rifite akamere ko iburyo cyangwa ibumoso
- **Kugenda Imbere:** Urubibi rifite akamere hejuru
- **Umuvuduko Muto:** Urubibi rifite inamba z'umweru

### Ibimenyetso by'Amakuru (Ibyanditswe)
- **Ibyerekezo:** Bitukuru kuri gariyandiko, birera kuri zonale
- **Intambwe:** Byera bifite inamba z'ikilometiri
- **Amakuru y'Abatangizi:** Bitukuru bifite ahantu h'amakuru`,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
    category: 'Traffic Signs',
    category_rw: "Ibyapa by'Umuhanda",
    readTime: '8 min read',
    date: '2025-01-10',
    author: 'ISHAMI Team',
    status: 'published',
  },
  {
    id: '3',
    slug: 'irembo-driving-license-step-by-step',
    title_en: 'How to Get Your Driving License Through IremboGov: Step-by-Step',
    title_rw: 'Uburyo bwo Kubona Uruhushya rwo Gutwara kuri IremboGov: Intambwe Zose',
    excerpt_en: 'A complete walkthrough of Rwanda\'s digital driving license application process through IremboGov, from provisional to definitive license.',
    excerpt_rw: 'Amabwiriza yose yo gusaba uruhushya rwo gutwara kuri IremboGov, utangiranye n\'urw\'agateganyo uja ku rwa burundu.',
    content_en: `## Getting Your Provisional License

The provisional (e-Provisional) license is your first step to legally driving in Rwanda.

### Requirements
- Valid National ID
- Test registration code (from your driving school)
- Active phone number for SMS
- Email address

### Steps
1. Visit www.irembo.gov.rw or dial *909#
2. Log in with your phone number
3. Navigate to "Police" section → "Driving License"
4. Select "Provisional License"
5. Enter your exam registration code
6. Your scores will auto-populate from the system
7. Select pickup location
8. Pay 10,000 RWF via mobile money
9. Download your digital license immediately

### Pass Requirements
- **Busanza Automated Center:** 60% minimum
- **Other Centers:** 12/20 minimum

## Upgrading to Definitive License

After passing your practical driving test, you can upgrade to a definitive license.

### Requirements
- Valid e-Provisional license
- Practical driving test certificate
- Selected pickup station

### Steps
1. Log in to IremboGov
2. Select "Definitive License"
3. Enter practical test certificate number
4. Select collection station
5. Pay the statutory fee
6. Wait for SMS notification (processing: up to 21 days)
7. Collect your physical card at the selected station

## Important Tips
- Your billing ID is valid for only 1 hour — pay promptly
- Download your e-Provisional immediately after payment
- Keep your phone active for SMS updates
- Contact support@ishami.rw if you encounter issues`,
    content_rw: `## Kubona Uruhushya rw'Agateganyo

Uruhushya rw'agateganyo (e-Provisional) ni intambwe yawe ya mbere yo gutwara neza mu Rwanda.

### Ibisabwa
- Indangamuntu iramye
- Kode yo kwiyandikisha ku kizamini (ivuye mu ishuri ryo kwigisha)
- Numero ya telefoni ifunctional kugira ngo ubone SMS
- Aderesi ya imeri

### Intambwe
1. Jya kuri www.irembo.gov.rw cyangwa ukande *909#
2. Injira ukoresheje numero yawe ya telefoni
3. Jya ku bwoko bwa "Police" → "Uruhushya rwo Gutwara"
4. Hitamo "Uruhushya rw'Agateganyo"
5. Shyiramo kode yawe y'ikizamini
6. Amanota yawe azazura mu buryo bw'ikoranabuhanga
7. Hitamo aho uruhushya rwawe ruzabera
8. Ishyura 10,000 RWF ukoresheje Mobile Money
9. Kurura uruhushya rwawe rw'ikoranabuhanga ako kanya

### Ibisabwa byo Gutsinda
- **Busanza Automated Center:** 60% nibura
- **Ahandi hose:** 12/20 nibura

## Kuzamura ku Ruhushya rwa Burundu

Ushize gutsinda ikizamini cyo gutwara mu muhanda, ushobora kwiyongera ku ruhushya rwa burundu.

### Ibisabwa
- Uruhushya rw'agateganyo rufite agaciro
- Icyemezo cyo gutsinda ikizamini cy'ingiro
- Sitasiyo yoroshye kuzahiraho uruhushya

### Intambwe
1. Injira kuri IremboGov
2. Hitamo "Uruhushya rwa Burundu"
3. Shyiramo nimero y'icyemezo cy'ikizamini
4. Hitamo sitasiyo yo kuzafatiraho
5. Ishyura amafaranga y'ubwishyu
6. Tegereza ubutumwa bugufi (SMS) — biratwara iminsi igera kuri 21
7. Fata ikarata yawe ya burundu ku sitasiyo yatoranijwe

## Inama Zingenzi
- Kode yawe y'ubwishyu iramara amaso 1 gusa — ishyura vuba
- Kurura uruhushya rwawe rw'ikoranabuhanga ko umaze kwishyura
- Guma ufite telefone ikora kugira ngo ubone amakuru kuri SMS`,
    image: 'https://images.unsplash.com/photo-1449965408869-ebd0eb6c8e15?w=800&h=400&fit=crop',
    category: 'Licensing',
    category_rw: "Uruhushya",
    readTime: '7 min read',
    date: '2025-01-05',
    author: 'ISHAMI Team',
    status: 'published',
  },
  {
    id: '4',
    slug: 'rainy-season-driving-rwanda',
    title_en: 'Rainy Season Driving in Rwanda: Essential Safety Tips',
    title_rw: "Gutwara mu Bihe by'Imvura mu Rwanda: Inama Zingenzi z'Umutekano",
    excerpt_en: 'Rwanda has two rainy seasons that dramatically affect road conditions. Learn how to adjust your driving technique, maintain proper following distance, and handle wet roads safely.',
    excerpt_rw: "Rwanda ifite ibihe bibiri by'imvura bitera ingaruka kandi cane ku bwoko bw'umuhanda. Menya uko wakoresha uburyo bwo gutwara, ukagumana intera isanzwe, kandi ukore neza ku muhanda unyerera.",
    content_en: `## Rwanda's Rainy Seasons

Rwanda experiences two distinct rainy seasons each year:

- **Long Rains (Umuhindo):** March through May — heavy, persistent rainfall
- **Short Rains (Igihumbi):** October through December — shorter but intense bursts

Both seasons bring significant changes to road conditions across the country, from Kigali's urban streets to rural hillside roads.

## Before You Drive in the Rain

### Vehicle Preparation
- **Tires:** Check tread depth — worn tires dramatically increase stopping distance on wet roads. Minimum legal tread depth is 1.6mm.
- **Wipers:** Replace worn wiper blades. Test both low and high speeds. Carry spare fluid.
- **Lights:** Ensure all lights work — headlights, taillights, brake lights, and indicators. You'll need them even during daytime rain.
- **Brakes:** Have your brake pads inspected before the rainy season. Wet brakes are less effective.

### Essential Items to Carry
- A small towel or cloth for clearing condensation
- Emergency triangle or reflective vest
- Phone charger (for GPS in case of detours)

## Driving Techniques for Wet Roads

### Increase Your Following Distance
On dry roads, a 3-second following distance is standard. In rain, increase this to **4–5 seconds minimum**. Wet pavement can double your braking distance.

**How to measure:** Pick a fixed object ahead. When the car in front passes it, count: "one-thousand-one, one-thousand-two..." If you pass the object before reaching the count, you're too close.

### Reduce Speed
- **Urban areas:** Drop from 40 km/h to 30–35 km/h
- **Rural roads:** Reduce by 10–15 km/h below the posted limit
- **Never exceed** the speed that allows you to stop within the distance you can see

### Smooth Inputs
Sudden steering, braking, or acceleration on wet roads can cause skidding or hydroplaning. Use gentle, progressive inputs:
- Brake earlier and more gently
- Accelerate slowly from stops
- Steer gradually through curves

### Use Low Beam Headlights
Always use headlights in rain — not just for visibility but so other drivers can see you. Use **low beam** (not high beam, which reflects off rain and reduces visibility).

## Dangerous Conditions to Watch For

### Hydroplaning (Aquaplaning)
When water builds up between your tires and the road surface, you lose traction. This typically happens at speeds above 60 km/h on flooded roads.

**If it happens:**
- Don't brake suddenly
- Ease off the accelerator gently
- Keep the steering wheel straight
- Wait for the tires to regain grip

### Hidden Puddles & Flooding
Rwanda's hilly terrain means water flows downhill fast. What looks like a shallow puddle can be 30+ cm deep. Never drive through flooded roads if you can't see the bottom.

### Landslides & Rock Falls
During heavy rains, hillside roads are prone to landslides. Watch for:
- Fresh soil or rocks on the road
- Cracks in the hillside above
- Water streaming across the road from the hillside

If you see these signs, stop, turn around, and find an alternate route.

## Night Driving in Rain
Night rain is the most dangerous driving condition:
- **Slow down significantly** — visibility may be reduced to 20–30 meters
- **Use low beam headlights** and fog lights if available
- **Increase following distance** to 6+ seconds
- **Avoid overtaking** unless absolutely necessary
- **Watch for pedestrians** — they're harder to see and may be walking in the road to avoid puddles on the shoulder

## After the Rain Stops
- Roads remain slippery for 15–30 minutes after rain stops
- Watch for debris washed onto the road
- Be cautious at intersections — oil and dust create slick surfaces when mixed with water
- Check for damage to road surfaces — potholes often appear after heavy rain

## Key Takeaways
1. **Prepare your vehicle** before the rainy season starts
2. **Increase following distance** to 4–5 seconds
3. **Reduce speed** and use smooth inputs
4. **Use low beam headlights** at all times
5. **Never drive through flooded roads** if you can't see the bottom
6. **Watch for landslides** on hillside roads
7. **Be extra cautious at night**`,
    content_rw: `## Ibihe by'Imvura mu Rwanda

Rwanda ifite ibihe by'imvura bitandukanye bibiri buri mwaka:

- **Imvura ndende (Umuhindo):** Kuva muri Werurwe gushika muri Gicurasi — imvura ihoraho idukorano
- **Imvura nke (Igihumbi):** Kuva muri Ukwakira gushika muri Ukuboza — imvura yihuse ariko ikomeye

Ibihe byombi birabangamira imiterere y'umuhanda mu buryo bunini mu gihugu cose, ukuyobora aho mu mijyi ya Kigali no ku mihanda y'imisozi.

## Mbere yo Gutwara mu Mvura

### Gutegura Imodoka
- **Amatareti:** Reba neza ubujyakuzimu — amatareti yarakaye ayongera intera yo guhagarika cane ku muhanda unyerera. Ubujyakuzimu bukwiye kuba buhari nibura 1.6mm.
- **Amabaruru:** Hindura amabaruru yarakaye. Gerageza neza ubwihuse bwose. Fata amabaraho angana.
- **Amatara:** Reba neza ko amatara yose akora — amabago, amabago y'inyuma, n'ibimenyetso. Uzayakeneye mu gihe cy'imvura nanone.
- **Feri:** Reba neza ko amapaki y'feri aramye mbere y'ibihe by'imvura. Feri z'umuhanda unyerera zitakora neza.

### Ibintu Ukeneye Kubona
- Igitambo cyangwa agakamandarari gato kugira ngo uke amazi y'ibyumba
- Igitara cy'akabaho cyangwa ikamba ry'akajyana
- Shargarila y telefone (kugira ngo GPS ikore mu gihe hashyirwe inzira nshya)

## Uburyo bwo Gutwara ku Muhanda Unyerera

### Ongeza Intera yo Gukurikirana
Ku muhanda ukonje, intera yo gukurikirana ni masegonda 3 gusa. Mu mvura, ongerera kuri **masegonda 4–5 nibura**. Umuhanda unyerera ushobora kongera intera yo guhagarika inshuro ebyiri.

**Uburyo bwo kugereranya:** Hitaho ikintu cyo hejuru y'umuhanda. Igihe ikinyabiziga kiri imbere kiribona, tuba twisesenga: "rimwe na mirongo imwe..." Niba ukigerera kuri kimwe usigaye utabonye, uri hafi cyane.

### Gabanya Umuvuduko
- **Mu mijyi:** Gabanya kuri 30–35 km/h mu badu 40 km/h
- **Mu mihanda y'imisozi:** Gabanya kuri 10–15 km/h hasi y'ibyapa bihari
- **Nta giheurenze** umuvuduko ukwiringana no guhagarika mu isura uri ubona

### Koresha Ibikorwa Bihagije
Guhindura umuhanda, gufata feri, cyangwa kwongera umuvuduko cane cane ku muhanda unyerera bishobora gutuma utakaza uburinzi cyangwa ukama ku nyanja. Koresha ibikorwa byoroshye, bifitanye:
- Tora feri mbere kandi neza
- Tangira umuvuduko neza
- Hindura neza mu makorosi

### Koresha Amatara Maremare
Mu gihe cy'imvura, ureke amatara yose akora — atari yo kubona gusa ahubwo abandi basoza bashobora kukubona. Koresha **amatara maremare** (ntakoresha amatara arekereza imvura kandi agabanya ubusobanuro).

## Ibintu Byiza Utakwemerera Gukorera

### Kwama Ku Nyanja (Hydroplaning)
Igihe amazi ahoraho hagati y'amatareti n'umuhanda, utakaza uburinzi. Ibi bisanzwe biraba mu gihe umuvuduko urenga 60 km/h ku muhanda wahagaze amazi.

**Niba bibaye:**
- Ntufate feri bwihuse
- Koma umuvuduko neza neza
- Komeza ikibaho cy'umuhanda gikwiye
- Tegereza amatareti agire uburinzi

### Amazi y'Abanga bushya n'Ubwoba bw'Amazi
Umitere w'imisozi y'u Rwanda urategeka ko amazi agendera hasi vuba. Igihe urabona nk'amazi y'ubucucu ariko arashobora kuba ararenze 30+ cm. Nta gihe ukwiringane guca mu muhanda wahagaze amazi niba utabonye uwo ari we uwo.

### Kuboneka kw'Imisozi no Kuboneka kw'Amafaranga
Mu gihe cy'imvura ikomeye, imihanda y'imisozi irashobora kubona imisozi. Reba:
- Ubutaka bushya cyangwa amabuye ku muhanda
- Imfunguzo mu misozi hejuru
- Amazi atembera mu muhanda ava mu misozi

Niba ubonye ibi, hagarara, usubire inyuma, kandi urongere inzira nshya.

## Kugenda Nijoro mu Mvura
Nijoro mu mvura ni uburyo bwo gutwara bukomeye cane:
- **Gabanya umuvuduko cane cane** — ubusobanuro bushobora kugabanutwa kuri mirongo 20–30
- **Koresha amatara maremare** n'amafogu niba ari ho
- **Ongeza intera yo gukurikirana** kuri masegonda 6+
- **Ntukinyuranho** uretse birakenewe cane cane
- **Reba abanyamaguru** — ntibonesekere neza kandi bashobora kugendera mu muhanda kugira ngo birinde amazi y'akamandarari

## Nyuma y'Imvura Iraheze
- Umuhanda uracyakora uburinzi bwihuse munsi 15–30 nyuma y'uko imvura irarangira
- Reba amabuye cyangwa ibintu byose byatondetse ku muhanda
- Itondere ku masangano y'imihanda — amavuta n'umucaca bigira ibintu byiza igihe bihuje n'amazi
- Reba neza umuhanda — ingendo zisanzwe zishobora kuboneka nyuma y'imvura ikomeye

## Ibintu Ushobora Kwiyumvira
1. **Tegura imodoka** mbere y'uko umvhiringanyo w'imvura utangira
2. **Ongeza intera yo gukurikirana** kuri masegonda 4–5
3. **Gabanya umuvuduko** kandi ukoreshe ibikorwa byoroshye
4. **Koresha amatara maremare** buri gihe
5. **Nta gihe ukwiringane mu muhanda wahagaze amazi** niba utabonye uwo ari we uwo
6. **Reba neza imisozi** ku mihanda y'imisozi
7. **Itondere cane cane ijoro**`,
    image: 'https://images.unsplash.com/photo-1428591501234-1ffcb0d93150?w=800&h=400&fit=crop',
    category: 'Safety Tips',
    category_rw: "Inama z'Umutekano",
    readTime: '9 min read',
    date: '2025-02-10',
    author: 'ISHAMI Team',
    status: 'published',
  },
  {
    id: '5',
    slug: 'parking-rules-rwanda',
    title_en: 'Parking Rules in Rwanda: Where You Can and Cannot Park',
    title_rw: "Amategeko y'Guhagarika Ibinyabiziga mu Rwanda: Aho Usobanukirwa no Kwigenda",
    excerpt_en: 'Parking violations are one of the most common traffic fines in Rwanda. Learn where you can park, where you cannot, time limits, and the penalties for breaking parking rules.',
    excerpt_rw: "Amakosa yo guhagarika ibinyabiziga ni kimwe mu bintu bisanzwe bifite amande mu Rwanda. Menya aho ushobora guhagarika, aho utashobora, igihe, n'ibihano byo gucunga amategeko y'guhagarika.",
    content_en: `## Overview

Parking violations are among the most common traffic offenses in Rwanda, and they carry significant fines. The Rwanda National Police and automated camera systems actively enforce parking regulations, especially in Kigali.

## Where You CAN Park

### Designated Parking Zones
- **Marked parking bays** (white or yellow lines forming a box)
- **Paid parking zones** in Kigali CBD — use the parking meters or mobile payment systems
- **Private parking lots** with permission from the property owner
- **Residential areas** — along the roadside where no restrictions are posted

### General Rules for Legal Parking
- Park parallel to the curb, facing the direction of traffic
- Leave at least 1 meter between your vehicle and the curb
- Ensure your vehicle doesn't protrude into the traffic lane
- Turn off your engine and engage the handbrake
- Lock your vehicle and don't leave valuables visible

## Where You CANNOT Park

### Absolute No-Parking Zones
These areas are strictly off-limits at all times:

- **Zebra crossings** and within 5 meters of either side
- **Bus stops** and within 10 meters approaching a bus stop
- **Fire hydrants** and within 3 meters
- **Traffic light intersections** and within 10 meters
- **Roundabout approaches** and exits — within 15 meters
- **Hill crests and blind curves** — you cannot see oncoming traffic
- **Bridge approaches** and within 5 meters of either side
- **Tunnel entrances and exits** — within 20 meters
- **Emergency vehicle access routes**
- **Hospitals and school entrances** — within 15 meters

### Restricted Zones (May Have Time Limits)
- **"No Parking" signs** (blue circle with red X) — no parking at any time
- **"No Stopping" signs** (blue circle with red cross) — no stopping at all, not even to drop off
- **Bus lanes** — parking or stopping in a bus lane is prohibited
- **Loading zones** — trucks only, and only during loading hours
- **Taxi stands** — reserved for taxis only
- **Disabled parking bays** — only vehicles with a disability permit

### Situational Restrictions
- **During road construction** — follow temporary signs
- **During official events** — road closures may apply
- **When double-parked** — parking alongside another parked vehicle is illegal

## Time Limits

### Drop-Off Zones
- Maximum **5 minutes** for dropping off or picking up passengers
- Driver must remain with the vehicle
- Staying longer risks immediate towing

### Paid Parking Zones (Kigali)
- **First hour:** 200 RWF
- **Each additional hour:** 100 RWF
- **Maximum stay:** 8 hours
- **Payment:** Via SMS to 1515, or through the parking app
- **Operating hours:** Monday–Saturday, 7:00 AM – 6:00 PM
- **Free on Sundays and public holidays**

### Residential Parking
- Generally unrestricted outside business areas
- Don't block driveways or gates
- Don't park in front of someone's property entrance for extended periods

## Penalties & Fines

| Violation | Fine |
|-----------|------|
| Parking in a no-parking zone | 10,000 RWF |
| Parking on a zebra crossing | 10,000 RWF |
| Blocking traffic flow | 15,000 RWF |
| Parking in a disabled bay without permit | 20,000 RWF |
| Double parking | 15,000 RWF |
| Exceeding drop-off time limit | 10,000 RWF + towing costs |
| Expired paid parking | 2,000 RWF |

### Additional Consequences
- **Towing:** Your vehicle will be towed at your expense (typically 15,000–30,000 RWF tow fee)
- **Impoundment:** Serious violations may result in vehicle impoundment for up to 7 days
- **Demerit points:** Parking violations may result in points on your driving record
- **Repeat offenders:** Persistent violations may result in higher fines and possible license suspension

## How to Pay Parking Fines

### Via IremboGov
1. Visit www.irembo.gov.rw or dial *909#
2. Navigate to Police → Fines
3. Enter your vehicle plate number
4. Select the fine and pay via mobile money
5. Keep your payment receipt

### Via SMS
- Send your plate number to 1515
- Follow the payment prompts

### Time Limit
- Fines must be paid within **3 days**
- Late payment adds a **10,000 RWF** penalty

## Tips for Stress-Free Parking in Kigali

1. **Arrive early** — CBD parking fills up quickly, especially during business hours
2. **Use the parking app** — it shows available spots and lets you pay digitally
3. **Check signs carefully** — parking rules change block by block
4. **Take a photo** of where you parked — helps you find your car and proves your parking position
5. **Keep change ready** — some meters only accept coins
6. **Park in well-lit areas** at night for safety
7. **Don't park under trees** during windy conditions — falling branches cause damage

## Key Takeaways
1. **Only park in marked bays** — when in doubt, don't park there
2. **Never block zebra crossings, bus stops, or fire hydrants**
3. **Respect time limits** in drop-off and paid zones
4. **Pay fines promptly** — the 3-day deadline is strict
5. **Use official payment channels** — IremboGov or SMS to 1515
6. **When unsure, find a paid parking lot** — it's cheaper than a fine`,
    content_rw: `## Ibisobanuro

Amakosa yo guhagarika ibinyabiziga ni kimwe mu bintu bisanzwe bifite amande mu Rwanda, kandi bifite amande menshi. Polisi y'Igihugu cya Rwanda na sisitemu y'amera z'akamera zikoresha amategeko yo guhagarika ibinyabiziga, mu bijyanye cane na Kigali.

## Aho Ushobora Guhagarika

### Ahantu Hasanzwe Ho Guhagarika
- **Imibiri yo guhagarika** (imirongo yera cyangwa y'umutuku itondetse ibara rimwe)
- **Ahantu ha kwishyura** mu Kigali CBD — koresha metre y'amafaranga cyangwa uburyo bwo kwishyura kuri telefone
- **Ahantu ha private** witonya nabayobozi
- **Ahantu h'abaturatse** — hasi y'umuhanda aho nta mategeko arihari

### Amategeko yo Guhagarika Neza
- Guhagarika buryoburyo hamwe n'akamandarari, ujya mu direction y'umuhanda
- Leave at least 1 meter hagati y'ikinyabiziga cyawe n'akamandarari
- Reba neza ko ikinyabiziga cyawe kitarenga mu muhanda wo gutwara
- Zima moteri ukore feri y'ibirenge
- Fungura ikinyabiziga kandi ntushire ibintu byiza kubonwa

## Aho Utashobora Guhagarika

### Ahantu Ntushobora Guhagarika Rwose
Ibi bihantu birabujijwe buri gihe:

- **Imirongo yera y'abanyamaguru** kandi hasi y'ametero 5 hejuru y'uburyo bubiri
- **Ahantu ho gufatiramo ibinyabiziga** kandi hasi y'ametero 10 imbere y'aho
- **Amazi yo gucunga incunga** kandi hasi y'ametero 3
- **Ahantu h'ibimenyetso** kandi hasi y'ametero 10
- **Imbere ya rond-point** — hasi y'ametero 15
- **Aho umuhanda uremereye** — ntubibonereze neza
- **I Bridge** — hasi y'ametero 5 hejuru y'uburyo bubiri
- **I Tunnel** — hasi y'ametero 20
- **Inzira z'ibinyabiziga z'ubutabazi**
- **Ibitaro n'amashuri** — hasi y'ametero 15

### Ahantu Ha Gukata (Birashobora kuba bifite igihe)
- **Ibyapa bya "Ntuhagare"** (urubibi rw'uburera rifite akamere ko tuku) — nta gihe utashobora guhagarika
- **Ibyapa bya "Ntuhagare na gato"** (urubibi rw'uburera rifite akamere ko tuku) — ntuhagare icyo ari cyo cyose
- **Mayira y'ibinyabiziga** — guhagarika cyangwa kugumana birabujijwe
- **Ahantu ho gutangira** — ibinyabiziga byo gutangira gusa, mu gihe gusa cyo gutangira
- **Ahantu ho gutegereza ibinyabiziga** — ibyagenewe ibinyabiziga byo gutegereza gusa
- **Ahantu ho abafite ikibazo** — ibyagenewe ibinyabiziga bifite ikibazo gusa

### Ahantu Ha Kugabanya
- **Mu gihe cy'ubwiyunge bw'umuhanda** — kurikira ibyapa by'agateganyo
- **Mu gihe cy'ibikorwa vy'ubukwe** — umuhanda ushobora gufungwa
- **Igihe uhagarariye hamwe n'ikindi kinyabiziga** — birabujijwe

## Igihe

### Ahantu ho Guhagarika
- Igihe kiringo cy'**iminsi 5** yo gutangira abagenzi cyangwa gufata
- Umuyobozi agomba gufatanya n'ikinyabiziga
- Igihe kirekire rushobora gutuma ikinyabiziga kitwarwa na kigingi

### Ahantu Ha Kwishyura (Kigali)
- **Isaha ya mbere:** 200 RWF
- **Isaha isigaraye:** 100 RWF
- **Igihe kiringo:** Amasaha 8
- **Uburyo bwo kwishyura:** Na SMS kuri 1515, cyangwa na application
- **Amahera:** Ku mbere — Ku Gatandatu, 7:00 AM – 6:00 PM
- **Ubuntu mu Kirumbizi n'ibikorwa vy'ubukwe**

## Ibihano n'Amande

| Amakosa | Amande |
|---------|--------|
| Guhagarika aho nta guhagariko barihari | 10,000 RWF |
| Guhagarika ku mirongo yera y'abanyamaguru | 10,000 RWF |
| Kwanga umuhanda | 15,000 RWF |
| Guhagarika aho abafite ikibazo nta ikibazo | 20,000 RWF |
| Guhagarika hamwe n'ikindi kinyabiziga | 15,000 RWF |
| Kurenza igihe cyo gutangira | 10,000 RWF + amafaranga yo gutwara |
| Kwishyura igihe kirekire | 2,000 RWF |

### Ibindi Bintu
- **Kwitwara:** Ikinyabiziga cyawe kitwara ukoresheje amafaranga yawe (bisanzwe 15,000–30,000 RWF)
- **Gufatwa:** Amakosa amenye ashobora gutuma ikinyabiziga gifatwa iminsi 7
- **Amanota yo gukata:** Amakosa yo guhagarika ashobora gutuma amanota araba ku rupapuro rwawe rwo gutwara
- **Abakoze amakosa menshi:** Amakosa yo guhora ashobora gutuma amande menshi ndetse uruhushya rwawe rushobora guhagarika

## Uburyo bwo Kwishyura Amande

### Kuri IremboGov
1. Jya kuri www.irembo.gov.rw cyangwa ukande *909#
2. Jya ku Polisi → Amande
3. Shyiramo numero y'ibara ry'ikinyabiziga cyawe
4. Hitamo amande ukoresheje Mobile Money
5. Fata ikarata yo kwishyura

### Na SMS
- Ohereza numero y'ibara ryawe kuri 1515
- Kurikira inama zo kwishyura

### Igihe
- Amande agomba kwishyurwa mu **minsi 3**
- Igihe urenze, ongerwa amande y'**ubukererwe 10,000 RWF**

## Inama zo Guhagarika Neza mu Kigali

1. **Jya mbere** — ahantu ho guhagarika mu Kigali CBD buzama buzima buze vuba, mu gihe cy'akazi
2. **Koresha application** — iragaragaza aho ariho kandi ikwemerera kwishyura mu buryo bw'ikoranabuhanga
3. **Reba neza ibyapa** — amategeko y'guhagarika ahinduka buri kibanza
4. **Fata ishusho** y'aho wahagaje — iragufasha kubona ikinyabiziga cyawe kandi ikumenyesha aho wari
5. **Fata ingendo** — metero zimwe zemera amafaranga gusa
6. **Guhagarika mu buryo bwiza ijoro** kugira ngo ube umutekano
7. **Ntuguhagarehe ibiti** mu bihe by'umuyaga — impeta ziva mu ibiti zishobora gutuma ikibazo

## Ibintu Ushobora Kwiyumvira
1. **Guhagarika gusa mu mbiri zisanzwe** — niba utazi, ntuhagare
2. **Nta gihe kwanga imirongo yera, ahantu ho gufatiramo, cyangwa amazi yo gucunga incunga**
3. **Kurikira igihe** mu bihe byo gutangira no kwishyura
4. **Ishyura amande vuba** — iminsi 3 ni igihe kiringo
5. **Koresha uburyo bwo kwishyura bwemewe** — IremboGov cyangwa SMS kuri 1515
6. **Niba utabizi, jya aho kwishyura** — biri guto cyane kuruta amande`,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=400&fit=crop',
    category: 'Traffic Rules',
    category_rw: "Amategeko y'Umuhanda",
    readTime: '8 min read',
    date: '2025-02-20',
    author: 'ISHAMI Team',
    status: 'published',
  },
];

// Ferrivox Ltd Company Info
export const ferrivoxInfo = {
  name_en: 'Ferrivox Ltd',
  name_rw: 'Ferrivox Ltd',
  tagline_en: 'Software Development & Data Engineering Company',
  tagline_rw: 'Ishirahamwe ry\'Ikoranabuhanga n\'Ubufasha bw\'Amakuru',
  description_en: 'Ferrivox Ltd is a leading software development and data engineering company based in Rwanda. We build innovative digital solutions, including the ISHAMI driving education platform.',
  description_rw: 'Ferrivox Ltd ni ishirahamwe rikuru ry\'ikoranabuhanga n\'ubufasha bw\'amakuru riri mu Rwanda. Dukora uburyo bw\'ikoranabuhanga bushya, harimo urubuga rwa ISHAMI rwo kwiga gutwara.',
  website: 'https://ferrivox.com',
  email: 'info@ferrivox.com',
};
