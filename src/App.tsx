import useAssets from "./Hooks/useAssets";
import Root from "./Root/Routes";

export default function () {
  const assets = useAssets()
  return (
    <Root />
  )
}