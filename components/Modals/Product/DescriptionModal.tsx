import { Fragment } from "react";
import { simpleModalHandler } from "../../../services/helper";
import { ProductTypes } from "../../../services/types";

interface ThisProps {
  product: ProductTypes;
  index: number;
}

const DescriptionModal = ({ product, index }: ThisProps) => {
  return (
    <Fragment>
      <div className="hidden justify-self-center xl:block">
        <button
          className="btn btn-outline btn-accent btn-sm hover:text-white"
          onClick={() => simpleModalHandler(`description${index}`, true)}
        >
          Description
        </button>
        <dialog
          id={`description${index}`}
          data-theme={"skies"}
          className="modal"
        >
          <div className="no-scrollbar modal-box absolute max-w-2xl text-white">
            <button
              className="btn btn-circle btn-ghost absolute right-4 top-4 text-lg"
              onClick={() => simpleModalHandler(`description${index}`, false)}
            >
              ✕
            </button>
            <h3 className="modal-title mb-5">{product.name} - Description</h3>
            <div>
              {product.description} Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Rerum alias delectus officiis laboriosam aliquid
              cupiditate est enim, maiores perferendis autem voluptates ea
              architecto reprehenderit dolorem assumenda quia id eligendi quam
              repellendus animi possimus nulla? Consequuntur, quasi perferendis
              sunt porro rerum molestias temporibus obcaecati. Maiores sunt
              perspiciatis necessitatibus et numquam. Ea provident deleniti,
              impedit aspernatur error culpa dolore repellendus expedita
              aliquid? Omnis earum quas perferendis tempora animi cupiditate?
              Exercitationem ad laboriosam similique nisi ab fugit doloribus
              ratione itaque maiores assumenda? Nulla, numquam laborum et
              aliquid recusandae eum vel dolores voluptatibus voluptatem
              veritatis! Dignissimos porro, sapiente explicabo consectetur quas
              non aliquid? Deserunt quia voluptatibus consectetur necessitatibus
              sunt illum provident vitae hic corrupti deleniti voluptas quidem
              id ex debitis facere quisquam eum maiores tenetur quos voluptate
              mollitia excepturi, numquam expedita. Sed ullam dolorem, totam
              harum porro eligendi eveniet vero similique ipsa a maxime,
              excepturi officiis tempora earum rem ratione quaerat quis veniam
              voluptatibus! <br />
              <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae at
              officia a tenetur odio odit culpa velit commodi cumque ad
              perspiciatis voluptatibus cupiditate, sint iusto, hic distinctio
              voluptate amet cum magni necessitatibus impedit minus provident et
              rem! Repellat soluta nostrum eius assumenda quisquam ullam sequi.
              Laborum dicta quos dolore amet?
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              cum optio ut veniam dolorem. Doloremque, illum saepe? Quae ea sint
              veritatis, quaerat eos voluptatem sunt quos impedit doloribus
              cumque sed voluptates ad pariatur, tempore labore enim veniam
              obcaecati deleniti eligendi! Officia illo molestiae eligendi
              debitis aspernatur consectetur molestias libero quas. Molestias
              nisi totam ipsam ab! Voluptate libero dignissimos architecto
              ducimus nesciunt excepturi corporis eligendi atque consectetur,
              consequatur est, adipisci sint quis assumenda blanditiis aut,
              fugiat minus nobis. Tempora cumque deserunt necessitatibus libero
              veritatis sequi ut minus sit aliquid beatae vitae, fuga atque esse
              omnis consequuntur ex sint odio a quod!
            </div>
          </div>
        </dialog>
      </div>
    </Fragment>
  );
};

export default DescriptionModal;
