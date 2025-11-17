/**
 * Script para gerar ícones PWA simples
 * Execute: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Função para criar um PNG simples usando canvas (se disponível) ou criar um placeholder
function createIcon(size) {
  try {
    // Tentar usar canvas se disponível
    const { createCanvas } = require('canvas');
    
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fundo gradiente roxo
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Texto "Q" no centro
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Q', size / 2, size / 2);
    
    const buffer = canvas.toBuffer('image/png');
    return buffer;
  } catch (error) {
    console.log('Canvas não disponível, criando ícone simples...');
    // Se canvas não estiver disponível, criar um PNG mínimo válido
    // PNG mínimo: 1x1 pixel roxo
    return createMinimalPNG(size);
  }
}

function createMinimalPNG(size) {
  // PNG mínimo válido (1x1 pixel transparente)
  // Isso é um PNG válido mas muito simples
  // Em produção, você deve criar ícones reais
  const minimalPNG = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width = 1
    0x00, 0x00, 0x00, 0x01, // height = 1
    0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x1F, 0x15, 0xC4, 0x89, // CRC
    0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // compressed data
    0x0D, 0x0A, 0x2D, 0xB4, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  console.warn(`⚠️  Criando PNG mínimo. Para ícones reais, instale: npm install canvas`);
  console.warn(`   Ou use um gerador online: https://realfavicongenerator.net/`);
  return minimalPNG;
}

// Gerar os ícones
const publicDir = path.join(__dirname, 'public');

console.log('Gerando ícones PWA...');

try {
  // Criar logo192.png
  const icon192 = createIcon(192);
  fs.writeFileSync(path.join(publicDir, 'logo192.png'), icon192);
  console.log('✅ logo192.png criado');

  // Criar logo512.png
  const icon512 = createIcon(512);
  fs.writeFileSync(path.join(publicDir, 'logo512.png'), icon512);
  console.log('✅ logo512.png criado');

  console.log('\n✅ Ícones gerados com sucesso!');
  console.log('💡 Para ícones melhores, instale: npm install canvas');
  console.log('   Ou use: https://realfavicongenerator.net/');
} catch (error) {
  console.error('❌ Erro ao gerar ícones:', error.message);
  console.log('\n💡 Solução alternativa:');
  console.log('   1. Acesse: https://realfavicongenerator.net/');
  console.log('   2. Faça upload de uma imagem');
  console.log('   3. Baixe os ícones gerados');
  console.log('   4. Coloque logo192.png e logo512.png na pasta public/');
  process.exit(1);
}

