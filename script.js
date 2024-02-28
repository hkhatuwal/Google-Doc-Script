const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

$(document).ready(function () {
    $('#refresh').click(function (e){
getAllResearches()
    })
    getAllResearches()
})


$('input[name="content_from"]').change(function (e) {
    console.log(e)
    if (e.target.value === "selected_text") {
        $('#content-area').addClass("d-none")
    } else {
        $('#content-area').removeClass("d-none")

    }
})


$('#start-research').click(function () {
    var selectedType = $('input[name="content_from"]:checked').val()
    console.log(selectedType)
    if (selectedType === "custom_text") {
        const content=$('#content-area').val()
        startResearch(content)
        Toast.fire({
            icon: "success",
            title: "Research Started"
        });

    } else {
        google.script.run
            .withSuccessHandler(
                function (text, element) {
                    console.log(text)
                    startResearch(text)
                    Toast.fire({
                        icon: "success",
                        title: "Research Started"
                    });
                    element.disabled = false;
                })
            .withFailureHandler(
                function (msg, element) {
                    Toast.fire({
                        icon: "error",
                        title: msg
                    });
                })
            .getSelectedTextAsString();
    }

});


function callResearchStartApi(content, documentId) {
    const url = "https://hidden-waterfall-64289.pktriot.net/sparkai/api/research/google-doc";
    $.post(url, {
        content_to_be_researched: content,
        doc_id: documentId
    }, function (res) {
        getAllResearches()
    });


}


function callResearchFetchApi(docId) {
    const url = "https://hidden-waterfall-64289.pktriot.net/sparkai/api/research/google-doc?doc_id=" + docId;
    $.get(url, function (res) {

        let html = ""
        res.researches.forEach(function (item, index) {
            html += `<div class='col-12 card my-2'>
 <div class="card-body">
 <h6>${item.content_to_be_researched.slice(0, 60)}</h6>
</div>
 </div>`
        })

        $('.researches').append(html)
    });
}


function  getAllResearches(){

    google.script.run
        .withSuccessHandler(
            function (docId, element) {
                callResearchFetchApi(docId)

            })
        .withFailureHandler(
            function (msg, element) {
                Toast.fire({
                    icon: "error",
                    title: msg
                });
            })
        .getCurrentDocumentId();
}
function startResearch(content) {
    google.script.run
        .withSuccessHandler(
            function (docId, element) {
               callResearchStartApi(content,docId)

            })
        .withFailureHandler(
            function (msg, element) {
                Toast.fire({
                    icon: "error",
                    title: msg
                });
            })
        .getCurrentDocumentId();
}


