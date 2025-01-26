const app = Vue.createApp({
data() {
	return {
		activeTab: 'new',
		newLotTitle: '',
		newLotEndDate: '',
		newLotPrize: '',
		newLotComment: '',
		contests: [
			{ id: 1, title: 'Contest 1', created: '2025-01-01', ended: null, prize: 'Prize 1', comment: 'Comment 1', featured: false },
			{ id: 2, title: 'Contest 2', created: '2025-01-10', ended: '2025-01-20', prize: 'Prize 2', comment: 'Comment 2', featured: true },
			{ id: 3, title: 'Contest 3', created: '2025-01-05', ended: null, prize: 'Prize 3', comment: 'Comment 3', featured: false },
		],
		showModal: false,
		selectedContest: null
	};
},
computed: {
	sortedNewContests() {
		const currentDate = new Date();
		return this.contests
			.filter(contest => contest.ended === null || new Date(contest.ended) > currentDate)
			.sort((a, b) => new Date(b.created) - new Date(a.created));
	},
	sortedEndedContests() {
		const currentDate = new Date();
		return this.contests
			.filter(contest => contest.ended && new Date(contest.ended) <= currentDate)
			.sort((a, b) => new Date(b.ended) - new Date(a.ended));
	}
},
methods: {
	addNewLot() {
		if (this.newLotTitle.trim() !== '' && this.newLotEndDate && this.newLotPrize.trim() !== '') {
			const newContest = {
				id: this.contests.length + 1,
				title: this.newLotTitle,
				created: new Date().toISOString().split('T')[0],
				ended: this.newLotEndDate,
				prize: this.newLotPrize,
				comment: this.newLotComment,
				featured: false
			};
			this.contests.push(newContest);
			this.newLotTitle = '';
			this.newLotEndDate = '';
			this.newLotPrize = '';
			this.newLotComment = '';
			
			const telegramId = localStorage.getItem("telegramId");
			
			const contestData = {
				author_id: telegramId, // Пример ID автора
				prize: this.newLotPrize, // Приз
				description: this.newLotComment, // Описание конкурса
				start_date: new Date().toISOString(), // Дата начала
				end_date: this.newLotEndDate // Дата окончания
			  };
			addContest(newContest);
			
		}
	},
	openModal(contest) {
		this.selectedContest = contest;
		this.showModal = true;
	},
	closeModal() {
		this.showModal = false;
		this.selectedContest = null;
	}
}
});



// Функция для отправки данных о конкурсе на сервер
async function addContest(contestData) {
  

  try {
    const response = await fetch('https://giftshop-production.up.railway.app/add-contest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contestData),
    });

    // Проверка успешности запроса
    if (!response.ok) {
      throw new Error('Ошибка сервера');
    }

    const data = await response.json();
    console.log('Конкурс успешно добавлен:', data);
    alert(data.message); // Покажем сообщение пользователю

  } catch (error) {
    console.error('Ошибка при добавлении конкурса:', error);
    alert('Произошла ошибка при добавлении конкурса');
  }
}





app.mount('#app');