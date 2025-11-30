

interface HighlightsProps{
    img: string;
    title: string;

}

const Highlights = ({img, title}: HighlightsProps) => {
  return (
    <div className="flex flex-col items-center mx-3 cursor-pointer">
<div className="w-20 h-20 rounded-full overflow-hidden border p-1">
<img src={img} alt={title} className="w-full h-full object-cover rounded-full" />
</div>
<p className="text-sm mt-1 text-center">{title}</p>
</div>
  )
}

export default Highlights
