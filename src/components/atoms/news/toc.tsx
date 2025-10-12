export default function NewsToc() {
  return (
    <>
      <div className="meta-toc">
        <div className="box-readmore">
          <h3 className="text-xl font-bold">Mục lục</h3>
          <ul
            className="toc-list"
            data-toc="article"
            data-toc-headings="h1, h2, h3"
          ></ul>
        </div>
      </div>
    </>
  );
}
