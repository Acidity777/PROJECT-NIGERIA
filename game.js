// ============================================
// NAIJA LIFE SIMULATOR — LOCATION INTERACTIONS
// First gameplay expansion
// ============================================

// Add useful locations to every playable state.
Object.values(playable).forEach(place => {
  [
    "Market",
    "Business District",
    "Community Centre",
    "Government Office",
    "Police Station"
  ].forEach(location => {
    if (!place.locations.includes(location)) {
      place.locations.push(location);
    }
  });
});

// Give each location a meaningful description.
function locationDesc(name) {
  if (name.includes("Market")) {
    return "Buy food, manage your money, and explore small trading opportunities.";
  }

  if (name.includes("Job Centre")) {
    return "Apply for jobs. Your education, experience, and skills affect your chances.";
  }

  if (
    name.includes("Education") ||
    name.includes("Skills") ||
    name.includes("Training") ||
    name.includes("Apprenticeship")
  ) {
    return "Study or train to improve your qualifications and practical abilities.";
  }

  if (name.includes("Community")) {
    return "Help residents, improve public trust, and build community connections.";
  }

  if (name.includes("Business")) {
    return "Explore small-business opportunities and develop your entrepreneurial skills.";
  }

  if (name.includes("Government")) {
    return "Raise community issues, participate in civic activities, and build political influence.";
  }

  if (name.includes("Police")) {
    return "Report incidents and learn about the consequences of unlawful actions.";
  }

  if (name.includes("Property")) {
    return "Property ownership and management will be expanded in a later update.";
  }

  return "Visit this location to explore opportunities in your community.";
}

// Connect location buttons to gameplay.
function openLocation(name) {
  if (!g) return;

  // MARKET
  if (name.includes("Market")) {
    const choice = prompt(
      "NEIGHBOURHOOD MARKET\n\n" +
      "1 = Buy food for ₦500\n" +
      "2 = Try a hustle\n" +
      "3 = Leave the market\n\n" +
      "Enter 1, 2, or 3:"
    );

    if (choice === "1") {
      action("food");
    } else if (choice === "2") {
      action("hustle");
    } else {
      say("You left the market without making a purchase.");
    }

    return;
  }

  // JOB CENTRE
  if (name.includes("Job Centre")) {
    action("work");
    return;
  }

  // EDUCATION AND TRAINING
  if (
    name.includes("Education") ||
    name.includes("Skills") ||
    name.includes("Training") ||
    name.includes("Apprenticeship")
  ) {
    action("study");
    return;
  }

  // COMMUNITY CENTRE
  if (name.includes("Community")) {
    action("community");
    return;
  }

  // BUSINESS DISTRICT
  if (name.includes("Business")) {
    const choice = prompt(
      "BUSINESS DISTRICT\n\n" +
      "Your current money: ₦" +
      Math.round(g.money).toLocaleString("en-NG") +
      "\n\n" +
      "1 = Start a small trading business (₦2,000)\n" +
      "2 = Check your business\n" +
      "3 = Leave\n\n" +
      "Enter 1, 2, or 3:"
    );

    if (choice === "1") {
      if (g.acted) {
        say("You've used today's main action. Finish the day before starting a business.");
        return;
      }

      if (g.money < 2000) {
        say("You need ₦2,000 to start this small business.");
        return;
      }

      g.money -= 2000;

      g.business = g.business || {
        started: false,
        capital: 0,
        daysOperated: 0
      };

      if (g.business.started) {
        g.money += 2000;
        say("You already own a business. Visit again to manage it.");
        return;
      }

      g.business.started = true;
      g.business.capital = 2000;
      g.business.daysOperated = 0;

      g.career = "Small Business Owner";
      g.rep = clamp(g.rep + 2);
      g.influence += 1;
      g.acted = true;

      logEvent("Opened a small trading business with ₦2,000 capital.");

      say(
        "Your small business is open! " +
        "You invested ₦2,000. Business income and operating costs " +
        "will be developed in the next business-system update."
      );

      render();
      save();
    } else if (choice === "2") {
      if (g.business && g.business.started) {
        say(
          "Your business is open. Initial capital: ₦" +
          Math.round(g.business.capital).toLocaleString("en-NG") +
          ". Daily revenue is not implemented yet."
        );
      } else {
        say("You do not own a business yet. You can start one with ₦2,000.");
      }
    } else {
      say("You left the Business District.");
    }

    return;
  }

  // GOVERNMENT OFFICE
  if (name.includes("Government")) {
    const choice = prompt(
      "GOVERNMENT OFFICE\n\n" +
      "1 = Submit a community petition\n" +
      "2 = Check your political status\n" +
      "3 = Leave\n\n" +
      "Enter 1, 2, or 3:"
    );

    if (choice === "1") {
      if (g.acted) {
        say("You've used today's main action. Finish the day first.");
        return;
      }

      if (g.energy < 10) {
        say("You are too tired to prepare a petition. Rest first.");
        return;
      }

      g.energy = clamp(g.energy - 10);
      g.rep = clamp(g.rep + 3);
      g.influence += 2;
      g.acted = true;

      logEvent("Submitted a community petition at the Government Office.");

      say(
        "Your petition has been submitted. " +
        "Your reputation and political influence increased. " +
        "A full government-response system is still to be developed."
      );

      render();
      save();
    } else if (choice === "2") {
      say(
        "Political status: " + g.political +
        ". Reputation: " + g.rep +
        "/100. Community Leader eligibility begins on Day 5 " +
        "with at least 20 reputation."
      );
    } else {
      say("You left the Government Office.");
    }

    return;
  }

  // POLICE STATION
  if (name.includes("Police")) {
    const choice = prompt(
      "POLICE STATION\n\n" +
      "1 = Report a neighbourhood problem\n" +
      "2 = Review your current status\n" +
      "3 = Leave\n\n" +
      "Enter 1, 2, or 3:"
    );

    if (choice === "1") {
      if (g.acted) {
        say("You've used today's main action. Finish the day first.");
        return;
      }

      if (g.energy < 5) {
        say("You are too tired to make a report. Rest first.");
        return;
      }

      g.energy = clamp(g.energy - 5);
      g.rep = clamp(g.rep + 2);
      g.influence += 1;
      g.citizens.households = clamp(g.citizens.households + 2);

      g.acted = true;

      logEvent("Reported a neighbourhood problem at the Police Station.");

      say(
        "Your report has been recorded. " +
        "Community confidence improved slightly. " +
        "Investigations, arrests, and crime consequences " +
        "will require a later law-and-order system."
      );

      render();
      save();
    } else if (choice === "2") {
      say(
        "Current status: " + g.political +
        ". This version does not yet track criminal records or investigations."
      );
    } else {
      say("You left the Police Station.");
    }

    return;
  }

  // PROPERTY OFFICE
  if (name.includes("Property")) {
    say("Property ownership and management are planned for a later update.");
    return;
  }

  say(name + " is open. More activities will be added as the game develops.");
}
