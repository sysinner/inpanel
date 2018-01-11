<div id="incp-appinst-opopt-info-alert" class="alert" style="display:none"></div>

<div id="incp-appinst-opopt-info">
{[~it.operate.options :cv]}
{[if (cv.items && cv.items.length > 0) {]}
<div class="card">

  <div class="card-header">
    <strong>{[=cv.name]}</strong>
    {[if (cv.ref && cv.ref.app_id.length >= 12) {]}
    <p>Refer to App {[=cv.ref.app_id]}</p> 
    {[}]}
  </div>

  <div class="card-body">
    <table width="100%" class="incp-panel-table">
      {[~cv.items :cvf]}
      <tr>
        <td width="300" class="lpt-title">{[=cvf.name]}</td>
        <td>{[=cvf.value]}</td>
      </tr>
      {[~]}
    </table>
  </div>

  {[if (cv.subs && cv.subs.length > 0) {]}
  <div class="">
    <strong>App of Subscribers</strong>
    <p>{[=cv.subs.join(", ")]}</p>
  </div>
  {[}]}
</div>
{[}]}
{[~]}
</div>
