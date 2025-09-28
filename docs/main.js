document.addEventListener('DOMContentLoaded', () => {
  const passwordOutput = document.getElementById('password-output');
  const copyButton = document.getElementById('copy-btn');
  const lengthValue = document.getElementById('length-value');
  const passwordLength = document.getElementById('password-length');
  const includeLowercase = document.getElementById('include-lowercase');
  const includeUppercase = document.getElementById('include-uppercase');
  const includeNumbers = document.getElementById('include-numbers');
  const includeSymbols = document.getElementById('include-symbols');
  const generateButton = document.getElementById('generate-btn');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthFeedback = document.getElementById('strength-feedback');
  
  const passwordGenerator = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    
    generate(length = 12, options = {}) {
      const {
        includeLowercase = true,
        includeUppercase = true,
        includeNumbers = true,
        includeSymbols = true,
      } = options;
      
      if (length < 4 || length > 100) {
        throw new Error('Password length must be between 4 and 100 characters');
      }
      
      if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
        throw new Error('At least one character set must be selected');
      }
      
      let chars = '';
      if (includeLowercase) chars += this.lowercase;
      if (includeUppercase) chars += this.uppercase;
      if (includeNumbers) chars += this.numbers;
      if (includeSymbols) chars += this.symbols;
      
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
      
      let missingTypes = [];
      if (includeLowercase && !/[a-z]/.test(password)) missingTypes.push('lowercase');
      if (includeUppercase && !/[A-Z]/.test(password)) missingTypes.push('uppercase');
      if (includeNumbers && !/[0-9]/.test(password)) missingTypes.push('number');
      if (includeSymbols && !/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password)) missingTypes.push('symbol');
      
      if (missingTypes.length > 0) {
        return this.generate(length, options);
      }
      
      return password;
    },
    
    evaluateStrength(password) {
      if (!password) return { score: 0, feedback: 'La contraseña está vacía' };
      
      let score = 0;
      const feedback = [];
      
      if (password.length < 8) {
        feedback.push('La contraseña es demasiado corta');
      } else {
        score += Math.min(2, Math.floor(password.length / 8));
      }
      
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password)) score += 1;
      
      const repeats = password.length - new Set(password).size;
      if (repeats > 0) {
        score -= Math.min(2, repeats);
        feedback.push('Contiene caracteres repetidos');
      }
      
      score = Math.max(0, Math.min(5, score));
      
      if (score <= 2) {
        feedback.push('Considera usar una contraseña más larga con más variedad');
      }
      
      let strengthText;
      if (score <= 1) strengthText = 'Muy débil';
      else if (score === 2) strengthText = 'Débil';
      else if (score === 3) strengthText = 'Media';
      else if (score === 4) strengthText = 'Fuerte';
      else strengthText = 'Muy fuerte';
      
      if (feedback.length === 0) {
        if (score >= 4) {
          feedback.push('Excelente contraseña');
        } else if (score === 3) {
          feedback.push('Buena contraseña');
        }
      }
      
      return {
        score,
        strengthText,
        feedback: feedback.join('. ')
      };
    }
  };

  function generatePassword() {
    try {
      const length = parseInt(passwordLength.value);
      const options = {
        includeLowercase: includeLowercase.checked,
        includeUppercase: includeUppercase.checked,
        includeNumbers: includeNumbers.checked,
        includeSymbols: includeSymbols.checked
      };
      
      if (!Object.values(options).some(value => value)) {
        alert('Por favor, selecciona al menos una opción de caracteres.');
        return;
      }
      
      const password = passwordGenerator.generate(length, options);
      passwordOutput.value = password;
      
      evaluatePasswordStrength(password);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
  
  function evaluatePasswordStrength(password) {
    const { score, strengthText, feedback } = passwordGenerator.evaluateStrength(password);
    
    strengthBars.forEach((bar, index) => {
      bar.classList.toggle('active', index < score);
    });
    
    strengthFeedback.textContent = feedback ? `${strengthText}: ${feedback}` : strengthText;
  }
  
  async function copyToClipboard() {
    if (!passwordOutput.value) return;
    
    try {
      await navigator.clipboard.writeText(passwordOutput.value);
      const originalText = copyButton.innerHTML;
      
      copyButton.innerHTML = '✓';
      setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      alert('Error al copiar al portapapeles');
    }
  }
  
  generateButton.addEventListener('click', generatePassword);
  copyButton.addEventListener('click', copyToClipboard);
  
  passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
    if (passwordOutput.value) {
      generatePassword();
    }
  });
  
  [includeLowercase, includeUppercase, includeNumbers, includeSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (passwordOutput.value) {
        generatePassword();
      }
    });
  });
  
  generatePassword();
});

function savePreferences() {
  const preferences = {
    length: passwordLength.value,
    includeLowercase: includeLowercase.checked,
    includeUppercase: includeUppercase.checked,
    includeNumbers: includeNumbers.checked,
    includeSymbols: includeSymbols.checked
  };
  localStorage.setItem('passwordGeneratorPrefs', JSON.stringify(preferences));
}

function loadPreferences() {
  const savedPrefs = localStorage.getItem('passwordGeneratorPrefs');
  if (savedPrefs) {
    const preferences = JSON.parse(savedPrefs);
    passwordLength.value = preferences.length;
    lengthValue.textContent = preferences.length;
    includeLowercase.checked = preferences.includeLowercase;
    includeUppercase.checked = preferences.includeUppercase;
    includeNumbers.checked = preferences.includeNumbers;
    includeSymbols.checked = preferences.includeSymbols;
  }
}

[includeLowercase, includeUppercase, includeNumbers, includeSymbols, passwordLength].forEach(element => {
  element.addEventListener('change', savePreferences);
});

loadPreferences();
