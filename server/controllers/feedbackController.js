// Plik: server/controllers/feedbackController.js
const feedbackService = require('../services/feedbackService.js');

exports.reportBug = async (req, res, next) => {
  try {
    const { description, context } = req.body;

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required.' });
    }

    // Sprawdzamy, czy użytkownik jest zalogowany (czy istnieje req.auth)
    const userId = req.auth ? req.auth.userId : null;
    const reportingUser = req.auth ? { email: req.auth.email, userId: req.auth.userId, role: req.auth.role } : { email: 'Anonymous' };

    // Dodajemy informacje o użytkowniku (jeśli jest) i inne dane kontekstowe
    const reportContext = {
      ...context,
      userAgent: req.headers['user-agent'], // Dodajemy User-Agent
    };

    // Krok 1: Zapisz zgłoszenie w bazie danych
    const newReport = await feedbackService.createBugReport(description, reportContext, userId);

    // Krok 2 (Opcjonalny): Wyślij powiadomienie email
    const emailContext = { ...reportContext, reportingUser };
    feedbackService.sendBugReportEmail(description, emailContext).catch(emailError => {
      // Logujemy błąd wysyłki, ale nie blokujemy odpowiedzi dla użytkownika
      // Używamy loggera dla spójności
      const logger = require('../config/logger.js');
      logger.error('Failed to send bug report email, but the report was saved.', { error: emailError });
    });

    res.status(201).json({ message: 'Bug report submitted successfully.', reportId: newReport.id });
  } catch (error) {
    // Przekazujemy błąd do globalnego error handlera
    next(error);
  }
};