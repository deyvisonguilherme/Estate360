import { Agency, Development, Tour360 } from '../types';

export const initialAgencies: Agency[] = [
  {
    id: 'ag-1',
    name: 'Vanguard Properties',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80',
    cnpj: '12.345.678/0001-90',
    website: 'https://vanguardproperties.com.br',
    phone: '(11) 3890-4000',
    email: 'contato@vanguard.com.br',
    address: 'Av. Brigadeiro Faria Lima, 3477 - 14º andar',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04538-133',
    createdAt: '2025-01-15'
  },
  {
    id: 'ag-2',
    name: 'Skyline Real Estate',
    logoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=150&q=80',
    cnpj: '98.765.432/0001-10',
    website: 'https://skylinere.com.br',
    phone: '(21) 2540-8800',
    email: 'atendimento@skylinere.com.br',
    address: 'Av. Atlântica, 1702 - Copacabana',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22021-001',
    createdAt: '2025-02-01'
  },
  {
    id: 'ag-3',
    name: 'Bossa Nova Sotheby\'s',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    cnpj: '45.123.890/0001-44',
    website: 'https://bossanovasir.com.br',
    phone: '(11) 3061-0000',
    email: 'vendas@bossanova.com.br',
    address: 'Rua Gabriel Monteiro da Silva, 1820',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01442-002',
    createdAt: '2025-03-10'
  }
];

export const initialDevelopments: Development[] = [
  {
    id: 'dev-1',
    agencyId: 'ag-1',
    name: 'Residencial Aurora Sky Penthouse',
    code: 'AURORA-360',
    description: 'Empreendimento de altíssimo padrão com vista panorâmica de 360° para o skyline de São Paulo. Apartamentos duplex de 420m².',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Itaim Bibi',
    address: 'Rua Leopoldo Couto de Magalhães Júnior, 1100',
    lat: -23.5855,
    lng: -46.6806,
    coverUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    status: 'Ativo',
    createdAt: '2025-01-20'
  },
  {
    id: 'dev-2',
    agencyId: 'ag-2',
    name: 'Vista Park Towers Phase II',
    code: 'VPT-PH2',
    description: 'Torres residenciais integradas ao parque aquático e bosque privativo. Design biofílico assinado por arquitetos renomados.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    neighborhood: 'Barra da Tijuca',
    address: 'Av. das Américas, 8500',
    lat: -23.0003,
    lng: -43.3658,
    coverUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    status: 'Lançamento',
    createdAt: '2025-02-14'
  },
  {
    id: 'dev-3',
    agencyId: 'ag-1',
    name: 'Old Harbor Loft Renovation',
    code: 'OHL-101',
    description: 'Lofts no estilo industrial chic com pé direito duplo de 6 metros e estrutura de aço aparente restaurada.',
    city: 'Santos',
    state: 'SP',
    neighborhood: 'Gonzaga',
    address: 'Av. Ana Costa, 350',
    lat: -23.9611,
    lng: -46.3322,
    coverUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    status: 'Em Obras',
    createdAt: '2025-03-01'
  }
];

export const initialTours: Tour360[] = [
  {
    id: 'tour-1',
    developmentId: 'dev-1',
    name: 'Penthouse Duplex - Tour Interativo',
    description: 'Navegação imersiva completa pelo modelo decorado de 420m² do Residencial Aurora Sky.',
    slug: 'aurora-sky-penthouse',
    friendlyUrl: 'https://estate360.app/tour/aurora-sky-penthouse',
    status: 'Publicado',
    isPublished: true,
    createdAt: '2025-02-01',
    updatedAt: '2025-03-20',
    coverUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    seo: {
      metaDescription: 'Tour Virtual 360° do Residencial Aurora Sky Penthouse no Itaim Bibi, SP.',
      keywords: ['tour virtual 360', 'itaim bibi', 'duplex luxo', 'vanguard properties']
    },
    location: {
      address: 'Rua Leopoldo Couto de Magalhães Júnior, 1100',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04542-000',
      country: 'Brasil',
      lat: -23.5855,
      lng: -46.6806
    },
    images: [
      {
        id: 'img-1',
        tourId: 'tour-1',
        name: 'Living Room - Living Principal',
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2400&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=300&auto=format&fit=crop',
        order: 1,
        hotspots: [
          {
            id: 'hs-1',
            title: 'Ir para a Cozinha Gourmet',
            description: 'Acesse a cozinha conceito aberto com bancada em mármore Calacatta.',
            type: 'nav',
            icon: 'arrow',
            color: '#0f62fe',
            targetSceneId: 'img-2',
            yaw: 45,
            pitch: -5,
            autoShow: true,
            animation: 'pulse'
          },
          {
            id: 'hs-2',
            title: 'Varanda com Vista Panorâmica',
            description: 'Detalhes da sacada gourmet com pé direito duplo.',
            type: 'info',
            icon: 'info',
            color: '#ff8389',
            yaw: -110,
            pitch: 10,
            autoShow: false,
            animation: 'none'
          },
          {
            id: 'hs-3',
            title: 'Ir para a Suíte Master',
            description: 'Acesse o pavimento superior pela escada flutuante.',
            type: 'nav',
            icon: 'arrow',
            color: '#0f62fe',
            targetSceneId: 'img-3',
            yaw: 160,
            pitch: 15,
            animation: 'pulse'
          }
        ]
      },
      {
        id: 'img-2',
        tourId: 'tour-1',
        name: 'Cozinha Gourmet & Ilha',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2400&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=300&auto=format&fit=crop',
        order: 2,
        hotspots: [
          {
            id: 'hs-4',
            title: 'Voltar ao Living Principal',
            type: 'nav',
            icon: 'arrow',
            color: '#0f62fe',
            targetSceneId: 'img-1',
            yaw: -135,
            pitch: 0,
            animation: 'bounce'
          },
          {
            id: 'hs-5',
            title: 'Eletros Embutidos Gaggenau',
            description: 'Forno e cooktop de indução de alta performance integrados à marcenaria.',
            type: 'info',
            icon: 'star',
            color: '#f1c21b',
            yaw: 30,
            pitch: -12
          }
        ]
      },
      {
        id: 'img-3',
        tourId: 'tour-1',
        name: 'Suíte Master & Closet',
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2400&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=300&auto=format&fit=crop',
        order: 3,
        hotspots: [
          {
            id: 'hs-6',
            title: 'Ir para o Terraço da Suíte',
            type: 'nav',
            icon: 'arrow',
            color: '#0f62fe',
            targetSceneId: 'img-4',
            yaw: 80,
            pitch: 5
          },
          {
            id: 'hs-7',
            title: 'Descobrir Closet Senhor & Senhora',
            description: 'Armários Italianos Poliform com iluminação interna em LED.',
            type: 'image',
            icon: 'image',
            color: '#42be65',
            mediaUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1000&auto=format&fit=crop',
            yaw: -40,
            pitch: -8
          }
        ]
      },
      {
        id: 'img-4',
        tourId: 'tour-1',
        name: 'Terraço Rooftop & Jacuzzi',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop',
        order: 4,
        hotspots: [
          {
            id: 'hs-8',
            title: 'Voltar para a Suíte',
            type: 'nav',
            icon: 'arrow',
            color: '#0f62fe',
            targetSceneId: 'img-3',
            yaw: -170,
            pitch: -2
          }
        ]
      }
    ]
  },
  {
    id: 'tour-2',
    developmentId: 'dev-1',
    name: 'Penthouse Modelo 2 - Estudo de Decorado',
    description: 'Rascunho de tour alternativo para clientes compradores em potencial.',
    slug: 'aurora-sky-modelo-2',
    friendlyUrl: 'https://estate360.app/tour/aurora-sky-modelo-2',
    status: 'Rascunho',
    isPublished: false,
    createdAt: '2025-03-05',
    updatedAt: '2025-03-18',
    coverUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    seo: {
      metaDescription: 'Rascunho do tour Aurora Sky Modelo 2.',
      keywords: ['rascunho', 'decorado']
    },
    location: {
      address: 'Rua Leopoldo Couto de Magalhães Júnior, 1100',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04542-000',
      country: 'Brasil',
      lat: -23.5855,
      lng: -46.6806
    },
    images: [
      {
        id: 'img-201',
        tourId: 'tour-2',
        name: 'Hall de Entrada Privativo',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2400&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=300&auto=format&fit=crop',
        order: 1,
        hotspots: []
      }
    ]
  }
];
