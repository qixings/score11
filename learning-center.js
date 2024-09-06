// Sample YouTube tutorial links
const tutorials = {
    'Crash': {
        title: 'Crash Game Tutorial',
        video: 'https://www.youtube.com/embed/crash-game-example',
        description: 'Learn how to play Crash game and maximize your winnings.'
    },
    'Trading': {
        title: 'Trading Game Tutorial',
        video: 'https://www.youtube.com/embed/trading-game-example',
        description: 'A guide on how to trade in the game and manage risks.'
    },
    'Snake': {
        title: 'Snake Game Tutorial',
        video: 'https://www.youtube.com/embed/snake-game-example',
        description: 'Master the Snake game with these tips and tricks.'
    },
    'Color Trading': {
        title: 'Color Trading Game Tutorial',
        video: 'https://www.youtube.com/embed/color-trading-example',
        description: 'A detailed tutorial on playing the Color Trading game.'
    },
    'Big Small': {
        title: 'Big Small Game Tutorial',
        video: 'https://www.youtube.com/embed/big-small-game-example',
        description: 'Learn the strategies to play and win Big Small game.'
    },
    'Mines': {
        title: 'Mines Game Tutorial',
        video: 'https://www.youtube.com/embed/mines-game-example',
        description: 'Step-by-step guide to play and win at Mines.'
    },
    'Plinko': {
        title: 'Plinko Game Tutorial',
        video: 'https://www.youtube.com/embed/plinko-game-example',
        description: 'Plinko game rules and strategies to increase your odds.'
    },
    'Number Trading': {
        title: 'Number Trading Game Tutorial',
        video: 'https://www.youtube.com/embed/number-trading-example',
        description: 'Tips for successfully playing the Number Trading game.'
    },
    'Spin Win': {
        title: 'Spin Win Game Tutorial',
        video: 'https://www.youtube.com/embed/spin-win-game-example',
        description: 'Get a full overview of how to play Spin Win game.'
    },
    'Deposit': {
        title: 'How to Deposit',
        video: 'https://www.youtube.com/embed/deposit-example',
        description: 'Learn how to deposit funds securely and efficiently.'
    },
    'Withdraw': {
        title: 'How to Withdraw',
        video: 'https://www.youtube.com/embed/withdraw-example',
        description: 'A complete guide on withdrawing your winnings.'
    },
    'Add Bank Account': {
        title: 'How to Add/Change Bank Account or USDT',
        video: 'https://www.youtube.com/embed/add-bank-account-example',
        description: 'Steps to add or update your bank account or USDT information.'
    },
    'Gift Code': {
        title: 'How to Use a Gift Code',
        video: 'https://www.youtube.com/embed/gift-code-example',
        description: 'Redeem your gift code with this easy step-by-step tutorial.'
    },
    'Become Agent': {
        title: 'How to Become an Agent',
        video: 'https://www.youtube.com/embed/become-agent-example',
        description: 'Learn how to become an agent and start earning commissions.'
    }
};

// Function to display the selected tutorial
function showGameTutorial(game) {
    const tutorialContent = tutorials[game];
    const tutorialTitle = tutorialContent.title;
    const tutorialVideo = tutorialContent.video;
    const tutorialDescription = tutorialContent.description;

    // Update the tutorial content dynamically
    document.querySelector('#tutorialContent h3').textContent = tutorialTitle;
    document.querySelector('#tutorialVideo').src = tutorialVideo;
    document.querySelector('#tutorialContent p').textContent = tutorialDescription;
}
