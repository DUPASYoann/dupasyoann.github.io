// Editorial summaries, not verbatim abstracts. Primary sources were checked on 2026-10-14.
export const enrichment = {
  dupas2026mefa: {
    doi: "10.1117/12.3091555",
    url: "https://hal.science/hal-05368360",
    pdf: "https://hal.science/hal-05368360/document",
    study: "mefa-ms",
    summary: {
      fr: "MEFA-MS repense la fusion précoce avec une architecture U-Net et des attentions spatiale et de canal. L’objectif : préserver la qualité de détection tout en réduisant le coût de l’inférence.",
      en: "MEFA-MS revisits early fusion with a U-Net architecture and spatial and channel attention. It aims to preserve detection quality while reducing inference cost.",
    },
    contribution: {
      fr: "Un encodeur-décodeur avec attention, évalué face à MEFA sur DENSE avec RT-DETR.",
      en: "An attention-based encoder-decoder, evaluated against MEFA on DENSE with RT-DETR.",
    },
  },
  dupas2026approches: {
    summary: {
      fr: "Ma recherche doctorale porte sur la fusion précoce d’images multimodales pour détecter les piétons et les véhicules. Elle s’inscrit dans une collaboration CIFRE entre Orange et le LIG.",
      en: "My doctoral research investigates early multimodal image fusion for pedestrian and vehicle detection, within a CIFRE collaboration between Orange and LIG.",
    },
    contribution: {
      fr: "Relier perception multimodale, mécanismes d’attention et détection d’objets.",
      en: "Connecting multimodal perception, attention mechanisms and object detection.",
    },
  },
  berjawi2025towards: {
    venue: "ICCV Workshops 2025 · MIRA",
    booktitle: "Proceedings of the IEEE/CVF International Conference on Computer Vision Workshops",
    doi: "10.1109/ICCVW69036.2025.00231",
    url: "https://arxiv.org/abs/2510.17078",
    pdf: "https://openaccess.thecvf.com/content/ICCV2025W/MIRA/papers/Berjawi_Towards_a_Generalizable_Fusion_Architecture_for_Multimodal_Object_Detection_ICCVW_2025_paper.pdf",
    study: "fmcaf",
    summary: {
      fr: "FMCAF combine filtrage fréquentiel et attention croisée pour fusionner les images RGB et infrarouges. L’architecture est évaluée sur la détection de piétons en faible lumière et de véhicules en vue aérienne.",
      en: "FMCAF combines frequency-domain filtering and cross-attention to fuse RGB and infrared images. It is evaluated on low-light pedestrian detection and aerial vehicle detection.",
    },
    contribution: {
      fr: "Une fusion étudiée sur deux contextes distincts : LLVIP et VEDAI.",
      en: "Fusion studied in two different settings: LLVIP and VEDAI.",
    },
  },
  dupas2025mefa: {
    title: "MEFA: Multimodal Image Early Fusion with Attention Module for Pedestrian and Vehicle Detection",
    authors: "Yoann Dupas, Olivier Hotel, Grégoire Lefebvre, Christophe Cérin",
    doi: "10.5220/0013236000003912",
    url: "https://hal.science/hal-05010469",
    pdf: "https://www.scitepress.org/Papers/2025/132360/132360.pdf",
    study: "mefa",
    summary: {
      fr: "MEFA fusionne les images visibles, infrarouges et LiDAR au moyen de mécanismes d’attention avant la détection. Le module est étudié avec YOLOv8 et RT-DETR, notamment sous la pluie et dans le brouillard.",
      en: "MEFA uses attention to fuse visible, infrared and LiDAR images before detection. It is studied with YOLOv8 and RT-DETR, including rainy and foggy conditions.",
    },
    contribution: {
      fr: "Une fusion en amont pour exploiter des détecteurs monomodaux existants.",
      en: "An upstream fusion module that works with existing single-modality detectors.",
    },
  },
  dupas2024empreinte: {
    url: "https://editions-rnti.fr/?inprocid=1002941",
    summary: {
      fr: "Cette communication est consacrée à l’empreinte énergétique de YOLOv8 pour la détection de piétons et de véhicules.",
      en: "This conference contribution focuses on the energy footprint of YOLOv8 for pedestrian and vehicle detection.",
    },
    contribution: {
      fr: "Mettre la question énergétique au cœur de l’évaluation des détecteurs.",
      en: "Bringing energy use into the evaluation of object detectors.",
    },
  },
};

export const researchCopy = {
  fr: {
    title: "La perception,<br><em>en pratique.</em>",
    intro: "Trois travaux pour explorer la fusion multimodale : ses architectures, sa robustesse et son coût d’inférence.",
    eyebrow: "RECHERCHE / TRAVAUX CHOISIS",
    studies: "Études de cas",
    allStudies: "Explorer les études de cas",
    readStudy: "Voir l’étude",
    readPaper: "Lire l’article",
    pdf: "Texte intégral (PDF)",
    record: "Notice",
    contribution: "L’essentiel",
    problem: "Le problème",
    method: "L’approche",
    outcome: "Ce que montre l’étude",
    role: "Mon rôle",
    firstAuthor: "Premier auteur",
    coauthor: "Coauteur",
    source: "Publication source",
    downloadCv: "Télécharger le CV (PDF)",
    current: "ACTUELLEMENT CHEZ LYNRED",
    currentText: "Ingénieur algorithme & IA en CDI. Mes domaines d’expertise : vision par ordinateur, deep learning et perception multimodale.",
    demoTitle: "Un même monde.<br>Plusieurs façons de le voir.",
    demoIntro: "Explorez ce que chaque capteur apporte à la perception d’une scène.",
    demoBadge: "SCHÉMA INTERACTIF · ILLUSTRATION PÉDAGOGIQUE",
    demoNote:
      "Scène synthétique : les annotations sont dessinées, sans exécution de modèle ni mesure de performance. Le mélange affiché illustre la complémentarité des signaux et ne reproduit pas MEFA.",
    modes: ["RGB", "Infrarouge", "LiDAR", "Fusion"],
    modesLabel: "Modalité affichée",
    conditions: "Conditions de visibilité",
    day: "Jour",
    night: "Nuit",
    fog: "Brouillard",
    mix: "Part de l’infrarouge dans l’illustration",
    annotation: "Afficher les objets annotés",
    person: "Piéton",
    car: "Véhicule",
    explanations: [
      "RGB : couleurs et textures de la scène. Dans cette illustration, la visibilité diminue la nuit et dans le brouillard.",
      "Infrarouge : une représentation illustrative du contraste thermique, qui met en évidence le piéton.",
      "LiDAR : un nuage de points schématique représente la géométrie et la distance des objets.",
      "Fusion : couleurs du RGB et contraste de l’infrarouge se superposent ici. Réglez le mélange pour explorer leurs apports.",
    ],
    steps: ["Entrées", "Fusion", "Détection"],
    measured: "Résultat rapporté par les auteurs",
    metricLabel: "Temps d’inférence",
    metricContext: "MEFA-MS face à MEFA, DENSE + RT-DETR. Comparaison issue du résumé HAL ; ce résultat concerne ce protocole expérimental.",
  },
  en: {
    title: "Perception,<br><em>in practice.</em>",
    intro: "Three studies exploring multimodal fusion: its architectures, robustness and inference cost.",
    eyebrow: "RESEARCH / SELECTED WORK",
    studies: "Case studies",
    allStudies: "Explore the case studies",
    readStudy: "View study",
    readPaper: "Read paper",
    pdf: "Full text (PDF)",
    record: "Record",
    contribution: "Key contribution",
    problem: "The problem",
    method: "The approach",
    outcome: "What the study shows",
    role: "My role",
    firstAuthor: "First author",
    coauthor: "Coauthor",
    source: "Source publication",
    downloadCv: "Download CV (PDF)",
    current: "CURRENTLY AT LYNRED",
    currentText: "Algorithm & AI engineer in a permanent role. My areas of expertise: computer vision, deep learning and multimodal perception.",
    demoTitle: "One world.<br>More than one way to see it.",
    demoIntro: "Explore what each sensor contributes to understanding a scene.",
    demoBadge: "INTERACTIVE DIAGRAM · EDUCATIONAL ILLUSTRATION",
    demoNote:
      "Synthetic scene: annotations are hand-drawn, with no model inference or performance measurement. The blend illustrates complementary signals and does not reproduce MEFA.",
    modes: ["RGB", "Infrared", "LiDAR", "Fusion"],
    modesLabel: "Displayed modality",
    conditions: "Visibility conditions",
    day: "Day",
    night: "Night",
    fog: "Fog",
    mix: "Infrared contribution in the illustration",
    annotation: "Show annotated objects",
    person: "Pedestrian",
    car: "Vehicle",
    explanations: [
      "RGB: scene colors and textures. In this illustration, visibility decreases at night and in fog.",
      "Infrared: an illustrative thermal-contrast view that highlights the pedestrian.",
      "LiDAR: a schematic point cloud represents object geometry and distance.",
      "Fusion: RGB colors and infrared contrast are overlaid here. Adjust the blend to explore their contributions.",
    ],
    steps: ["Inputs", "Fusion", "Detection"],
    measured: "Result reported by the authors",
    metricLabel: "Inference time",
    metricContext: "MEFA-MS versus MEFA, DENSE + RT-DETR. Comparison from the HAL abstract; this result applies to that experimental setup.",
  },
};

export const studies = [
  {
    id: "mefa",
    paper: "dupas2025mefa",
    title: "MEFA",
    tag: "RGB + IR + LiDAR → Attention → YOLO / RT-DETR",
    first: true,
    fr: {
      subtitle: "Fusionner avant de détecter.",
      problem: "Sous la pluie ou dans le brouillard, un capteur seul ne fournit pas toujours une représentation suffisante de la scène.",
      method:
        "Un module de fusion précoce par attention combine RGB, infrarouge et LiDAR avant un détecteur d’objets. L’étude compare cette approche à la concaténation des canaux.",
      outcome:
        "Le travail étudie la détection de piétons et de véhicules avec YOLOv8 et RT-DETR, dans des conditions météorologiques dégradées. Le module de fusion se place en amont de détecteurs monomodaux.",
    },
    en: {
      subtitle: "Fuse first. Detect next.",
      problem: "In rain or fog, a single sensor may not provide a sufficient representation of the scene.",
      method:
        "An attention-based early-fusion module combines RGB, infrared and LiDAR before an object detector. The study compares this approach with channel concatenation.",
      outcome:
        "The work studies pedestrian and vehicle detection with YOLOv8 and RT-DETR in adverse weather. Fusion is placed upstream of single-modality detectors.",
    },
  },
  {
    id: "mefa-ms",
    paper: "dupas2026mefa",
    title: "MEFA-MS",
    tag: "Multimodal → U-Net + Attention → RT-DETR",
    first: true,
    fr: {
      subtitle: "Rendre la fusion plus efficiente.",
      problem:
        "Le temps d’inférence de MEFA peut limiter son utilisation en conditions réelles. Il faut travailler le compromis entre qualité de détection et coût du modèle.",
      method: "MEFA-MS propose un encodeur-décodeur de type U-Net enrichi d’attentions spatiale et de canal, comparé au module MEFA sur DENSE.",
      outcome:
        "Avec RT-DETR sur DENSE, les auteurs rapportent un temps d’inférence réduit de 50 % par rapport à MEFA, ainsi qu’une amélioration du mAP50. Les résultats restent liés au protocole de l’article.",
    },
    en: {
      subtitle: "Make fusion more efficient.",
      problem: "MEFA’s inference time can limit real-world use. The trade-off between detection quality and model cost needs attention.",
      method: "MEFA-MS introduces a U-Net encoder-decoder with spatial and channel attention, compared with MEFA on DENSE.",
      outcome:
        "With RT-DETR on DENSE, the authors report 50% lower inference time than MEFA alongside improved mAP50. These findings apply to the paper’s experimental setup.",
    },
  },
  {
    id: "fmcaf",
    paper: "berjawi2025towards",
    title: "FMCAF",
    tag: "RGB + IR → Freq-Filter + Cross Attention → Detection",
    first: false,
    fr: {
      subtitle: "Explorer la généralisation de la fusion.",
      problem: "Une stratégie de fusion adaptée à un contexte ne se transfère pas nécessairement à d’autres scènes ou jeux de données.",
      method:
        "FMCAF associe un filtrage fréquentiel à une fusion par attention croisée. Il vise à limiter les informations redondantes et à mieux partager les indices entre RGB et infrarouge.",
      outcome:
        "L’architecture est évaluée sur LLVIP, pour les piétons en faible lumière, et VEDAI, pour les véhicules en vue aérienne. Ces évaluations explorent la robustesse dans deux contextes différents, sans établir une généralisation universelle.",
    },
    en: {
      subtitle: "Explore how fusion generalizes.",
      problem: "A fusion strategy suited to one setting does not necessarily transfer to different scenes or datasets.",
      method:
        "FMCAF combines frequency filtering with cross-attention fusion to reduce redundant information and improve RGB–infrared feature sharing.",
      outcome:
        "The architecture is evaluated on LLVIP for low-light pedestrians and VEDAI for aerial vehicles. These evaluations explore robustness in two different settings, without establishing universal generalization.",
    },
  },
];
