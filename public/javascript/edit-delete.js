const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1 ];

async function editHandler(event) {
    event.preventDefault();
    const title = document.querySelector('#post-title').value.trim();
    const post_text = document.querySelector('#post-text').value.trim();


    console.log(title, post_text);
    console.log(post_id);

    const response = await fetch(`/api/posts/${post_id}`, {
        method: 'put',
        body: JSON.stringify({
            title,
            post_text
        }),
        headers: { 'Content-Type': 'application/json'}
    })
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}


async function deleteHandler(event) {
    event.preventDefault();

    const response = await fetch(`/api/posts/${post_id}`, {
        method: 'delete',
    })
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText)
    }
}

document.querySelector('#edit-submit').addEventListener('click', editHandler);
document.querySelector('#delete-submit').addEventListener('click', deleteHandler);