/*
<!DOCTYPE html>
<html lang="en" class="w-full h-full">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <link href="output.css" rel="stylesheet">
</head>

<body class="h-full w-full">

</body>
<script src="dist/color.js"></script>

</html>
*/

export default function ColorPicker() {
  return (
    <div>
      <h1 className="h-fit flex-col font-bold text-4xl w-full justify-center text-center flex">
        Pallete generator:
      </h1>
      <div
        id="color"
        className="w-full flex flex-wrap p-4 justify-center items-center"
      >
        <div
          id="settings"
          className="m-auto inline-flex flex-wrap justify-center items-center text-center"
        >
          <div id="beg-settings" className="block w-fit mr-2 ml-auto">
            <div> beg color: </div>
            <input
              type="color"
              id="color-beg"
              className="input-color"
              value="#000000"
            />
          </div>
          <div id="end-settings" className="block w-fit ml-2 mr-auto">
            <div> end color: </div>
            <input
              type="color"
              id="color-end"
              className="input-color"
              value="#000000"
            />
          </div>

          <div id="count-settings" className="block w-full">
            <div> Number of colors: </div>
            <input type="number" id="color-count" min="2" value="5" />
          </div>
        </div>

        <div
          id="pallete"
          className="w-full h-40 flex flex-wrap items-center justify-center"
        ></div>
      </div>
    </div>
  );
}
