(() => {
    const container = document.getElementById('container');
    const name = document.getElementById('name');
    const surname = document.getElementById('surname');
    const middleName = document.getElementById('middlename');
    const born = document.getElementById('date');
    const faculty = document.getElementById('faculty');
    const startEd = document.getElementById('start_education');
    const button = document.getElementById('button');
    let messegeMistakes = document.getElementById('alert');

    let objectsList = [];
    let filterList = [];

    button.addEventListener('click', function() {
        let mistakes = [];
        const input = born.value;
        const dateEntered = new Date(input);
        let correctDate = dateEntered.toLocaleDateString();
        if (dateEntered < new Date('1900-01-01 00:00') || dateEntered > new Date()) {
            mistakes.push('Дата рождения должна быть от 01.01.1900 до текущего времени');
        };

        if ((Number(startEd.value.trim()) < 2000)) {
            mistakes.push('год обучения должен быть не меньше чем 2000');
        };

        if (name.value === '' || surname.value === '' || middleName.value === '' || born.value === '' || faculty.value === '' || startEd.value === '') {
            mistakes = ['все поля должны быть заполнены'];
        };

        if (mistakes.length === 0) {
            messegeMistakes.classList.remove('alert-danger');
            messegeMistakes.textContent = '';

            correctDate = correctDate.slice(3,6) + correctDate.slice(0,2) + correctDate.slice(5);

            let studentObject = {
                name: name.value.trim(),
                surname: surname.value.trim(),
                middleName: middleName.value.trim(),
                born: correctDate,
                faculty: faculty.value.trim(),
                startEducation: startEd.value.trim(),
                endEducation: String(Number(startEd.value.trim()) + 4),
                fullname: surname.value.trim() + name.value.trim() + middleName.value.trim(),
            };

            objectsList.push(studentObject);
            pushTable(objectsList);
            name.value = '';
            surname.value = '';
            middleName.value = '';
            born.value = '';
            faculty.value = '';
            startEd.value = '';
        }
        else {
            messegeMistakes.classList.add('alert-danger');
            let messege = mistakes.join(', ');
            messegeMistakes.textContent = messege;
        };
    });

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let headTr = document.createElement('tr');

    let nameTh = document.createElement('th');
    let facultyTh = document.createElement('th');
    let bornTh = document.createElement('th');
    let startEducationTh = document.createElement('th');

    table.classList.add('table');
    nameTh.classList.add('head-th');
    facultyTh.classList.add('head-th');
    bornTh.classList.add('head-th');
    startEducationTh.classList.add('head-th');

    startEducationTh.addEventListener('click', function() {
        objectsList.sort((prev, next) => prev.startEducation - next.startEducation);
        pushTable(objectsList);
    });

    bornTh.addEventListener('click', function() {
        objectsList.sort((prev, next) => new Date(prev.born) - new Date(next.born));
        pushTable(objectsList);
    });

    facultyTh.addEventListener('click', function() {
        objectsList.sort((prev, next) => prev.faculty.localeCompare(next.faculty));;
        pushTable(objectsList);
    });

    nameTh.addEventListener('click', function() {
        objectsList.sort((prev, next) => prev.fullname.localeCompare(next.fullname));;
        pushTable(objectsList);
    });

    nameTh.textContent = 'ФИО';
    facultyTh.textContent = 'Факультет';
    bornTh.textContent = 'Дата рождения(возраст)';
    startEducationTh.textContent = 'Дата начала обучения(курс)';

    container.append(table);
    table.append(thead, tbody);
    thead.append(headTr);
    headTr.append(nameTh, facultyTh, bornTh, startEducationTh);

    const filterName = document.getElementById('filter-name');
    const filterFaculty = document.getElementById('filter-faculty');
    const filterStartEducation = document.getElementById('filter-start_education');
    const filterEndEducation = document.getElementById('filter-end_education');
    const filterButton = document.getElementById('filter-button');
    const deleteButton = document.getElementById('delete-button');

    filterButton.addEventListener('click', function() {
        filterList = objectsList;
        filterList = filterList.filter(item => item.fullname.includes(filterName.value.trim()));
        filterList = filterList.filter(item => item.faculty.includes(filterFaculty.value.trim()));
        filterList = filterList.filter(item => item.startEducation.includes(filterStartEducation.value.trim()));
        filterList = filterList.filter(item => item.endEducation.includes(filterEndEducation.value.trim()));
        pushTable(filterList);
    });

    deleteButton.addEventListener('click', function() {
        pushTable(objectsList);
    });

    function pushTable(studentsList) {
        tbody.innerHTML = '';
        
        for (let cow = 0; cow < studentsList.length; cow++) {
            let bodyTr = document.createElement('tr');
            let nameTd = document.createElement('td');
            let facultyTd = document.createElement('td');
            let bornTd = document.createElement('td');
            let startEducationTd = document.createElement('td');

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dob = new Date(studentsList[cow].born);
            const dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
            let age;

            let course;
            const endEducation = new Date(today.getFullYear(), '08', '01');
            const startEducationForEndDucation = new Date(today.getFullYear() - 4, '08', '01');
            const startEducationThisStudent = new Date(studentsList[cow].startEducation, '08', '01');

            if (startEducationThisStudent >= startEducationForEndDucation) {
                if (today < endEducation) {
                    course = today.getFullYear() - studentsList[cow].startEducation;
                    course = ' (' + course + ' курс)';
                }
                else {
                    course = today.getFullYear() - studentsList[cow].startEducation + 1;
                    course = ' (' + course + ' курс)';
                };
            }
            else {
                course = ' (закончил)';
            };

            age = today.getFullYear() - dob.getFullYear();

            if (today < dobnow) {
              age = age-1;
            };

            const dateBorn = studentsList[cow].born;
            const correctBorn = dateBorn.slice(3,6) + dateBorn.slice(0,2) + dateBorn.slice(5);

            nameTd.textContent = studentsList[cow].surname + ' ' + studentsList[cow].name + ' ' + studentsList[cow].middleName;
            facultyTd.textContent = studentsList[cow].faculty;
            bornTd.textContent = correctBorn + ' (' + age + ' лет)';
            startEducationTd.textContent = studentsList[cow].startEducation + course;
            
            tbody.append(bodyTr);
            bodyTr.append(nameTd, facultyTd, bornTd, startEducationTd);
        };
    };

})();