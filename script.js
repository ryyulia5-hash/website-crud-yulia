document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bukuForm');
    const list = document.getElementById('bukuList');
    let books = JSON.parse(localStorage.getItem('inventory_buku')) || [];
    let editIndex = null;

    function formatRupiah(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    }

    function renderBooks() {
        list.innerHTML = '';
        books.forEach((book, i) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${book.judul}</td>
                <td>${book.kategori}</td>
                <td>${book.stok}</td>
                <td>Rp ${formatRupiah(book.harga)}</td>
                <td>
                    <button class="btn-edit" data-i="${i}">Edit</button>
                    <button class="btn-delete" data-i="${i}">Hapus</button>
                </td>
            `;
            list.appendChild(row);
        });
        localStorage.setItem('inventory_buku', JSON.stringify(books));
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const judul = document.getElementById('judul').value.trim();
        const kategori = document.getElementById('kategori').value;
        const stok = parseInt(document.getElementById('stok').value);
        const harga = parseInt(document.getElementById('harga').value);

        if (!judul || !kategori || isNaN(stok) || isNaN(harga)) {
            alert('Semua kolom wajib diisi dengan benar.');
            return;
        }

        if (editIndex !== null) {
            books[editIndex] = { judul, kategori, stok, harga };
            editIndex = null;
        } else {
            books.push({ judul, kategori, stok, harga });
        }

        form.reset();
        document.getElementById('stok').value = '0';
        document.getElementById('kategori').selectedIndex = 0;

        renderBooks();
    });

    list.addEventListener('click', function (e) {
        const i = parseInt(e.target.dataset.i);

        if (e.target.classList.contains('btn-edit')) {
            const book = books[i];
            document.getElementById('judul').value = book.judul;
            document.getElementById('kategori').value = book.kategori;
            document.getElementById('stok').value = book.stok;
            document.getElementById('harga').value = book.harga;
            editIndex = i;
        }

        if (e.target.classList.contains('btn-delete')) {
            if (confirm(`Hapus buku "${books[i].judul}"?`)) {
                books.splice(i, 1);
                renderBooks();
            }
        }
    });

    renderBooks();
});