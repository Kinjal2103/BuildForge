/**
 * Reference Catalog Data for BuildForge
 * Served dynamically via backend API routes.
 */

const CATEGORIES = [
  { name: 'CPUs', icon: 'memory', count: '48 Parts' },
  { name: 'GPUs', icon: 'developer_board', count: '36 Parts' },
  { name: 'Motherboards', icon: 'grid_view', count: '42 Parts' },
  { name: 'RAM', icon: 'settings_input_component', count: '54 Parts' },
  { name: 'Storage', icon: 'sd_storage', count: '32 Parts' },
  { name: 'Power Supplies', icon: 'electric_bolt', count: '24 Parts' },
  { name: 'Cases', icon: 'door_sliding', count: '18 Parts' },
  { name: 'Cooling', icon: 'ac_unit', count: '28 Parts' }
];

const GAMES = [
  { id: 'cyberpunk', name: 'Cyberpunk 2077', resolutionFPS: { '1080p': 165, '1440p': 115, '4K': 62 } },
  { id: 'cs2', name: 'Counter-Strike 2', resolutionFPS: { '1080p': 680, '1440p': 480, '4K': 290 } },
  { id: 'valorant', name: 'Valorant', resolutionFPS: { '1080p': 820, '1440p': 650, '4K': 410 } },
  { id: 'gta-v', name: 'GTA V', resolutionFPS: { '1080p': 240, '1440p': 185, '4K': 110 } },
  { id: 'apex', name: 'Apex Legends', resolutionFPS: { '1080p': 300, '1440p': 240, '4K': 144 } }
];

const COMMUNITY_BUILDS = [
  {
    id: 'build-obsidian',
    name: 'Project Obsidian',
    creator: 'HexEnthusiast',
    budget: 3840.00,
    likes: 1248,
    comments: 114,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop',
    specs: {
      cpu: 'Intel Core i9-14900K',
      gpu: 'ROG Strix GeForce RTX 4090 OC',
      ram: 'Dominator Titanium 64GB DDR5',
      motherboard: 'MPG Z790 Carbon WiFi',
      storage: 'Samsung 990 Pro M.2 NVMe 2TB',
      psu: 'Corsair RM1000x Shift ATX 3.0',
      case: 'Phanteks NV7 Premium Glass',
      cooler: 'Corsair iCUE H150i Elite LCD XT'
    }
  },
  {
    id: 'build-stealth-amd',
    name: 'Stealth AMD Beast',
    creator: 'RyzenRider',
    budget: 2320.00,
    likes: 852,
    comments: 42,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'Radeon RX 7900 XTX Gaming',
      ram: 'Trident Z5 RGB 32GB DDR5',
      motherboard: 'ROG Strix X670E-E Gaming WiFi',
      storage: 'Samsung 990 Pro M.2 NVMe 2TB',
      psu: 'Seasonic Focus GX-850 Gold',
      case: 'Lian Li O11 Dynamic EVO',
      cooler: 'Noctua NH-D15 chromax.black'
    }
  }
];

module.exports = {
  CATEGORIES,
  GAMES,
  COMMUNITY_BUILDS
};
