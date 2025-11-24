/**
 * Gerenciador de Áudio do Jogo
 * 
 * Sistema flexível para tocar sons e músicas no jogo.
 * Permite adicionar/remover sons facilmente.
 */

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicVolume = 0.3; // Volume da música (30%)
    this.soundVolume = 0.7; // Volume dos efeitos sonoros (70%)
    this.enabled = true; // Controle global de áudio
  }

  /**
   * Carrega um arquivo de som
   * @param {string} name - Nome do som (chave)
   * @param {string} path - Caminho do arquivo de áudio
   * @param {boolean} loop - Se deve repetir (para música)
   */
  loadSound(name, path, loop = false) {
    try {
      const audio = new Audio(path);
      audio.loop = loop;
      audio.volume = loop ? this.musicVolume : this.soundVolume;
      this.sounds[name] = audio;
      return true;
    } catch (error) {
      console.warn(`Não foi possível carregar o som: ${name}`, error);
      return false;
    }
  }

  /**
   * Toca um som
   * @param {string} name - Nome do som
   * @param {number} volume - Volume específico (0 a 1, opcional)
   * @param {number} duration - Duração em milissegundos (opcional, para parar após X ms)
   */
  playSound(name, volume = null, duration = null) {
    if (!this.enabled) return;

    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Som não encontrado: ${name}`);
      return;
    }

    try {
      // Garantir que o som não está em loop (exceto música)
      if (name !== 'backgroundMusic') {
        sound.loop = false;
      }
      
      // Se já estiver tocando, reinicia do início
      if (!sound.paused) {
        sound.currentTime = 0;
      }
      
      if (volume !== null) {
        sound.volume = Math.max(0, Math.min(1, volume));
      }
      
      sound.play().catch(error => {
        // Alguns navegadores bloqueiam autoplay - ignora silenciosamente
        console.debug(`Não foi possível tocar o som ${name}:`, error);
      });
      
      // Se uma duração foi especificada, parar após esse tempo
      if (duration !== null && duration > 0) {
        setTimeout(() => {
          this.stopSound(name);
        }, duration);
      }
    } catch (error) {
      console.warn(`Erro ao tocar som ${name}:`, error);
    }
  }

  /**
   * Para um som
   * @param {string} name - Nome do som
   */
  stopSound(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Toca música de fundo
   * @param {string} name - Nome da música
   */
  playMusic(name) {
    if (!this.enabled) return;

    // Para a música anterior se houver
    if (this.music) {
      this.stopMusic();
    }

    const music = this.sounds[name];
    if (music) {
      music.volume = this.musicVolume;
      music.loop = true;
      music.play().catch(error => {
        console.debug(`Não foi possível tocar a música ${name}:`, error);
      });
      this.music = music;
    }
  }

  /**
   * Para a música de fundo
   */
  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.music = null;
    }
  }

  /**
   * Define o volume dos efeitos sonoros
   * @param {number} volume - Volume (0 a 1)
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      if (!sound.loop) {
        sound.volume = this.soundVolume;
      }
    });
  }

  /**
   * Define o volume da música
   * @param {number} volume - Volume (0 a 1)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }

  /**
   * Ativa/desativa o áudio
   * @param {boolean} enabled - Se o áudio está habilitado
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
      Object.values(this.sounds).forEach(sound => {
        sound.pause();
      });
    }
  }

  /**
   * Precarrega todos os sons (opcional, para melhor performance)
   */
  preloadSounds() {
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
  }
}

// Instância singleton
const audioManager = new AudioManager();

// Carregar sons padrão (você pode adicionar seus próprios arquivos depois)
// Os caminhos são relativos à pasta public
const SOUND_PATHS = {
  // Efeitos sonoros
  move: '/sounds/move.mp3',
  keyCollect: '/sounds/key-collect.mp3',
  goalReach: '/sounds/goal-reach.mp3',
  collision: '/sounds/collision.mp3',
  buttonClick: '/sounds/button-click.mp3',
  
  // Música de fundo
  backgroundMusic: '/sounds/background-music.mp3',
};

// Carregar todos os sons
Object.entries(SOUND_PATHS).forEach(([name, path]) => {
  audioManager.loadSound(name, path, name === 'backgroundMusic');
});

export default audioManager;

