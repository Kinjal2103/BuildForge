const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const Product = require('../models/productModel');
const CommunityBuild = require('../models/communityBuildModel');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MAPPED_BUILDS = [
  {
    buildName: 'Project Obsidian',
    creatorUsername: 'HexEnthusiast',
    creatorEmail: 'hexenthusiast@buildforge.com',
    buildDescription: 'Ultimate performance stealth obsidian-themed PC. Packed with an RTX 4090 and 13900K for maximum high-framerate 4K gaming, AI modeling, and streaming.',
    buildPurpose: 'Gaming',
    coverImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop',
    likesCount: 1248,
    commentsCount: 0,
    tags: ['RTX4090', 'StealthBuild', 'Enthusiast', 'LiquidCooled'],
    specsMapping: {
      cpu: 'cpu-4',            // Intel Core i9-13900K
      gpu: 'gpu-41',           // NVIDIA GeForce RTX 4090 24GB
      motherboard: 'motherboard-9', // ASUS TUF Gaming Z790-Plus WiFi D4
      ram: 'ram-11',           // G.Skill Trident Z RGB 32GB DDR4 3600MHz
      storage: 'storage-42',   // WD Black SN850X 2TB NVMe Gen4 SSD
      psu: 'psu-21',           // Corsair RM750x 750W 80+ Gold PSU
      case: 'case-24',         // Corsair 4000D Airflow Mid-Tower Case
      cooler: 'cpucooler-43'   // ASUS ROG RYUJIN II 360 AIO Liquid Cooler
    }
  },
  {
    buildName: 'Stealth AMD Beast',
    creatorUsername: 'RyzenRider',
    creatorEmail: 'ryzenrider@buildforge.com',
    buildDescription: 'Full AMD stealth workstation. Excellent balance of multi-threaded CPU horsepower with high-end Radeon graphics. Engineered for content creation, programming, and VR gaming.',
    buildPurpose: 'Workstation',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    likesCount: 852,
    commentsCount: 0,
    tags: ['AMD', 'Stealth', 'Workstation', 'AirCooled'],
    specsMapping: {
      cpu: 'cpu-44',           // AMD Ryzen 9 7950X
      gpu: 'gpu-18',           // AMD Radeon RX 6700 XT 12GB
      motherboard: 'motherboard-47', // Gigabyte AORUS X570 Master
      ram: 'ram-12',           // Kingston Fury Beast 16GB DDR5 5200MHz
      storage: 'storage-13',   // Samsung 970 EVO Plus 1TB
      psu: 'psu-22',           // Seasonic Focus GX-650 650W
      case: 'case-25',         // Lian Li LANCOOL 205 Mesh
      cooler: 'cpucooler-26'   // Noctua NH-D15
    }
  }
];

const estimateFPS = (cpuName = '', gpuName = '') => {
  const cpuLower = cpuName.toLowerCase();
  const gpuLower = gpuName.toLowerCase();
  
  let fps1080p = 100;
  let fps1440p = 70;
  let fps4K = 35;

  if (gpuLower.includes('4090')) {
    fps1080p = 260;
    fps1440p = 190;
    fps4K = 95;
  } else if (gpuLower.includes('4070') || gpuLower.includes('6700 xt') || gpuLower.includes('6700xt')) {
    fps1080p = 160;
    fps1440p = 110;
    fps4K = 50;
  }

  if (cpuLower.includes('9 7950x') || cpuLower.includes('i9-13900k')) {
    fps1080p = Math.round(fps1080p * 1.15);
    fps1440p = Math.round(fps1440p * 1.1);
  }

  return { fps1080p, fps1440p, fps4K };
};

const estimatePowerConsumption = (cpuName = '', gpuName = '') => {
  const cpuLower = cpuName.toLowerCase();
  const gpuLower = gpuName.toLowerCase();

  let cpuWatts = 105;
  let gpuWatts = 200;

  if (cpuLower.includes('13900k')) cpuWatts = 125;
  if (gpuLower.includes('4090')) gpuWatts = 450;

  return cpuWatts + gpuWatts + 75;
};

const runMigration = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing.');
    }

    console.log('Connecting to database for migration...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Clear existing community builds to allow fresh import
    await CommunityBuild.deleteMany({});
    console.log('Cleared existing CommunityBuild records.');

    for (const buildData of MAPPED_BUILDS) {
      console.log(`Processing build: ${buildData.buildName}...`);

      // 1. Create or Find Author
      let author = await User.findOne({ email: buildData.creatorEmail });
      if (!author) {
        console.log(`Creating user: ${buildData.creatorUsername}...`);
        const hashedPassword = await bcrypt.hash('password123', 12);
        author = await User.create({
          name: buildData.creatorUsername,
          email: buildData.creatorEmail,
          password: hashedPassword,
          role: 'user',
          bio: `Hardware enthusiast and custom builder. Creator of ${buildData.buildName}.`,
          profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          profileBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
          followersCount: 12,
          followingCount: 5,
          showcasePostsCount: 1,
          totalLikesReceived: buildData.likesCount,
          reputationScore: buildData.likesCount * 5 + 10 + 24
        });
      } else {
        author.showcasePostsCount += 1;
        author.totalLikesReceived += buildData.likesCount;
        author.reputationScore = author.totalLikesReceived * 5 + author.showcasePostsCount * 10 + author.followersCount * 2;
        await author.save({ validateBeforeSave: false });
      }

      // 2. Fetch products and build specs snapshot
      const specsSnapshot = {};
      let totalCost = 0;
      const productIds = Object.values(buildData.specsMapping);
      const products = await Product.find({ _id: { $in: productIds } });

      const requiredSlots = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler', 'psu', 'case'];
      for (const slot of requiredSlots) {
        const prodId = buildData.specsMapping[slot];
        const product = products.find(p => p._id === prodId || p.id === prodId);

        if (!product) {
          throw new Error(`Product not found for slot ${slot} with ID: ${prodId}`);
        }

        specsSnapshot[slot] = {
          productId: product._id,
          name: product.name,
          brand: product.brand || '',
          image: product.imageUrl || '',
          currentPrice: product.price,
          snapshotPrice: product.price
        };

        totalCost += product.price;
      }

      // 3. Estimate stats
      const cpuName = specsSnapshot.cpu.name;
      const gpuName = specsSnapshot.gpu.name;
      const { fps1080p, fps1440p, fps4K } = estimateFPS(cpuName, gpuName);
      const powerConsumption = estimatePowerConsumption(cpuName, gpuName);

      // Socket validation
      const cpuLower = cpuName.toLowerCase();
      const mbLower = specsSnapshot.motherboard.name.toLowerCase();
      let compatibilityScore = 100;
      if (
        ((cpuLower.includes('intel') || cpuLower.includes('i9') || cpuLower.includes('i5')) && (mbLower.includes('x570') || mbLower.includes('b550') || mbLower.includes('am4') || mbLower.includes('am5'))) ||
        ((cpuLower.includes('amd') || cpuLower.includes('ryzen')) && (mbLower.includes('z790') || mbLower.includes('b760') || mbLower.includes('lga1700')))
      ) {
        compatibilityScore = 0;
      }

      // 4. Create community build document
      const communityBuild = await CommunityBuild.create({
        author: author._id,
        usernameSnapshot: author.name,
        profileImageSnapshot: author.profilePicture,
        buildName: buildData.buildName,
        buildDescription: buildData.buildDescription,
        buildPurpose: buildData.buildPurpose,
        coverImage: buildData.coverImage,
        galleryImages: [buildData.coverImage],
        videoShowcase: '',
        specs: specsSnapshot,
        totalCost,
        estimatedFPS1080p: fps1080p,
        estimatedFPS1440p: fps1440p,
        estimatedFPS4K: fps4K,
        powerConsumption,
        compatibilityScore,
        tags: buildData.tags,
        likesCount: buildData.likesCount,
        commentsCount: 0,
        cloneCount: Math.round(buildData.likesCount * 0.15), // estimate clone counts as 15% of likes
        status: 'published',
        visibility: 'public'
      });

      console.log(`Successfully migrated build: ${communityBuild.buildName} with ID: ${communityBuild._id}`);
    }

    console.log('Migration completed successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
};

runMigration();
