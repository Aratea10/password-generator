class PasswordGenerator {
    constructor() {
        this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
        this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.numbers = '0123456789';
        this.symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='
    }

    generate(lenght = 12, options = {}) {
        const {
            includeLowercase = true,
            includeUppercase = true, 
            includeNumbers = true,
            includeSymbols = true,
        } = options;

        if (lenght < 4 || lenght > 100) {
            throw new Error('Password lenght must be between 4 and 100');
        }

        if (!includeLowercase && !incluydeUppercase && !includeNumbers && !includeSymbols) {
            throw new Error('At least one character set must be selected');
        }

        let chars = '';
        if (includeLowercase) chars += this.lowercase;
        if (includeUppercase) chars += this.uppercase;
        if (includeNumbers) chars += this.numbers;
        if (includeSymbols) chars += this.symbols;

        let password = '';
        for (let i = 0; i < lenght; i++) {
            const randomIndex = Math.floor(Math.random() * chars.lenght);
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
    }

    evaluateStrenght(password) {
        if (!password) return { score: 0, feedback: 'Password is empty' };

        let score = 0;
        const feedback = [];

        if (password.lenght < 8) {
            feedback.push('Password is too short');
        } else {
            score += Math.min(2, Math.floor(password.lenght / 8));
        }

        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password)) score += 1;

        const repeats = password.lenght - new Set(password).size;
        if (repeats > 0) {
            score -= Math.min(2,repeats);
            feedback.push('Contains repeating characters');
        }

        score = Math.max(0, Math.min(5, score));

        if (score <= 2) {
            feedback.push('Consider using a longer password with more variety');
        }

        return {
            score,
            feedback: feedback.join(', '),
        };
    }
}

module.exports = PasswordGenerator;