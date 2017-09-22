export const createTrack = (formData) => (
  $.ajax({
    method: 'POST',
    url: 'api/tracks/',
    processData: false,
    contentType: false,
    data: formData,
  })
);

export const deleteTrack = (id) => (
  $.ajax({
    method: 'DELETE',
    url: `api/tracks/${id}`,
  })
);

export const getUserTracks = (username) => (
  $.ajax({
    method: 'GET',
    url: `api/users/${username}/tracks`,
  })
);

export const getTrack = (id) => (
  $.ajax({
    method: 'GET',
    url: `api/tracks/${id}`,
  })
);
