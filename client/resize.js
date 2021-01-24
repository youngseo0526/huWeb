FlowRouter.template('/resize', 'resize');

Template.resize.onRendered(function() {

    var upload = document.querySelector('#inp-file');
    var upload2 = document.querySelector('#preview');

    /* FileReader 객체 생성 */
    var reader = new FileReader();

    /* reader 시작시 함수 구현 */
    reader.onload = (function () {
        this.image = document.createElement('img');
        var vm = this;
        return function (e) {
            /* base64 인코딩 된 스트링 데이터 */
            vm.image.src = e.target.result
        }
    })()

    upload.addEventListener('change',function (e) {
        var get_file = e.target.files;
        if(get_file){
            reader.readAsDataURL(get_file[0]);
        }
        image.style.width = '400px';
        image.style.height = 'auto';
        image.style.display = 'block';
        image.style.margin = 'auto';

        preview.appendChild(image);
    })
});

Template.resize.helpers({
    contents: function() {
        // CONTENTS 데이터베이스를 화면에 전달
        return DB_RESIZE.findAll();
    },
    createdAt: function() {
        // 화면에 보이는 날짜 데이터를 정해진 포맷으로 변환하여 전달
        return this.createdAt.toStringHMS();
    },
    link: function() {
        // 저장 된 이미지 링크를 반환
        return DB_FILES.findOne({_id: this.resize_id}).link();
    }
});

Template.resize.events({
    'click #btn-resize': function(evt, inst) {
        var chk = document.getElementById('inp-file');
        if(!chk.value){
            $('#btn-resize').attr('href','');
            alert('이미지 파일을 먼저 업로드 해주세요.');
        }
        else {
            // 파일 먼저 저장
            var file = $('#inp-file').prop('files')[0];   // 화면에서 선택 된 파일 가져오기
            var resize_id = DB_FILES.insertFile(file);
            // DB 저장 시 파일의 _id와 name을 함께 저장
            DB_RESIZE.insert({    // 컨텐츠 DB에 저장
                createdAt: new Date(),          // 저장 시각
                content: $('#ta-article').val(),// 저장 컨텐츠
                resize_id: resize_id                // 저장된 resize 파일의 _id
            });
            // 저장 후 화면 정리
            $('#inp-file').val('');
            $('#ta-article').val('');
            $('#btn-resize').attr('href','resize_');
            //alert('저장 되었습니다.');
        }
    },
    'click #btn-remove': function() {
        if(confirm('삭제 하시겠습니까?')) {
            DB_RESIZE.remove({_id: this._id});  // 선택 컨텐츠를 DB에서 삭제
            alert('삭제 되었습니다.');
        }
    }
});