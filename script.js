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
let researches=[]

const BASE_URL="https://hidden-waterfall-64289.pktriot.net/sparkai"
$(document).ready(function () {
    $('#refresh').click(function (e) {
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
        const content = $('#content-input').val()
        console.log(content)

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
    const url = BASE_URL+"/api/research/google-doc";
    $.post(url, {
        content_to_be_researched: content,
        doc_id: documentId
    }, function (res) {
        getAllResearches()
    });


}


function callResearchFetchApi(docId) {

    const url =BASE_URL+ "/api/research/google-doc?doc_id=" + docId;
    $.get(url, function (res) {
        let html = ""
        researches=res.researches;
        res.researches.forEach(function (item, index) {
            html += `<div class='col-12 card my-2 d-flex flex-row align-items-center' >
 <div class="card-body" style="cursor: pointer;" onclick="copyResearchContentToClipboard(${item.id})">
 <h6  data-id="${item.id}">${item.content_to_be_researched.slice(0, 60)}</h6>
 <span class="badge  bg-primary">${item.status}</span>
</div>
                <img style="cursor: pointer;" onclick="removeResearch(${item.id})" height="50" width="50" src="https://cdn.iconscout.com/icon/free/png-256/free-delete-892-1167842.png" alt="">

 </div>`
        })

        $('.researches').append(html)
    });
}


function getAllResearches() {

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
                callResearchStartApi(content, docId)
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

function removeResearch(id){
    $.delete(BASE_URL+"/api/research/google-doc/"+id,function(result){
        Toast.fire({
            "icon":"success",
            "title":"Removed successfully"
        })
    })
}

function copyResearchContentToClipboard(id) {
    const item= researches.find(function (item){
        return item.id=id;
    })
    console.log(item)
    if(item && item.status==="success"){
        copyToClipboard(item.researched_content)
    }
}


function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    Toast.fire({
        icon: "success",
        title: "Copied to clipboard"
    });
}