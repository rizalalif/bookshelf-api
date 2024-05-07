const { nanoid } = require("nanoid");
const Allbook = require("./books");

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;

  if (readPage === pageCount) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  if (newBook.name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  Allbook.push(newBook);

  const isSuccess = Allbook.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal menambahkan buku",
  });
  response.code(400);
  return response;
};

const getAllBooks = (request, h) => {
  const { name } = request.query;
  const { reading } = request.query;
  const { finished } = request.query;

  const read = Allbook.filter((b) => b.reading === true);
  const unread = Allbook.filter((b) => b.reading === false);
  const finish = Allbook.filter((b) => b.finished === true);
  const unfinish = Allbook.filter((b) => b.finished === false);

  if (reading === 1) {
    const books = read.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    return {
      status: "success",
      data: { books },
    };
  } else if (reading === 0) {
    const books = unread.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    return {
      status: "success",
      data: { books },
    };
  }

  if (finished === 1) {
    const books = finish.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    return {
      status: "success",
      data: { books },
    };
  } else if (finished === 0) {
    const books = unfinish.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    return {
      status: "success",
      data: { books },
    };
  }

  const books = Allbook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  return {
    status: "success",
    data: { books },
  };
  
};

// const getBook = (request, h) => {
//   const { bookId } = request.params;

//   const book = Allbook.filter((b) => b.id === bookId)[0];

//   if (book === undefined) {
//     const response = h.response({
//       status: "fail",
//       message: "Buku tidak ditemukan",
//     });
//     response.code(404);
//     return response;
//   }

//   const response = h.response({
//     status: "success",
//     data: { book },
//   });
//   response.code(200);
//   return response;
// };
const getBookFinished = (request, h) => {
  const { bookId } = request.params;
  // const { reading } = request.query;

  const book = Allbook.find((b) => b.id === bookId);
  // const read = Allbook.filter((b) => b.id === bookId && isReading === 1);
  // const unread = Allbook.filter((b) => b.id === bookId && isReading === 0);

  if (book === undefined) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  if (book.finished === true) {
    const response = h.response({
      status: "success",
      data: { book },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: { book },
  });
  response.code(200);
  return response;
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const updatedAt = new Date().toISOString();
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = Allbook.findIndex((book) => book.id === bookId);

  // if (readPage > 0) {
  //   reading = true
  // }

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  } else if (name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  Allbook[index] = {
    ...Allbook[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const i = Allbook.findIndex((b) => b.id === bookId);

  if (i === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  if (Allbook[i].finished === true) {
    Allbook.splice(i, 1);

    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  } else if (Allbook[i].id === bookId) {
    Allbook.splice(i, 1);

    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
};

// const getBookReading = (request, h) => {
//   const { bookId } = request.params;
//   const { isReading } = request.query.reading;

//   const read = Allbook.filter((b) => b.id === bookId && isReading === 1);
//   const unread = Allbook.filter((b) => b.id === bookId && isReading === 0);

//   if (read === undefined && unread === undefined) {
//     const response = h.response({
//       status: "fail",
//       message: "Buku tidak ditemukan",
//     });
//     response.code(404);
//     return response;
//   }
//   if (isReading === 0) {
//     const books = unread.map((b) => ({
//       id: b.id,
//       name: b.name,
//       publisher: b.publisher,
//     }));
//     const response = h.response({
//       status: "success",
//       message: { books },
//     });
//     response.code(200);
//     return response;
//   } else if (isReading === 1) {
//     const books = read.map((b) => ({
//       id: b.id,
//       name: b.name,
//       publisher: b.publisher,
//     }));
//     const response = h.response({
//       status: "success",
//       message: { books },
//     });
//     response.code(200);
//     return response;
//   }
// };

module.exports = {
  addBook,
  getAllBooks,
  getBookFinished,
  updateBook,
  deleteBook,
};
