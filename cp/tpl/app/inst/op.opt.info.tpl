<div id="incp-appinst-opopt-info-alert" class="alert" style="display:none"></div>

<div id="incp-appinst-opopt-info">
{[~it.operate.options :cv]}
{[if (cv.items && cv.items.length > 0) {]}
<div class="card">

  <div class="card-header">
    <strong>{[=cv.name]}</strong>
    {[if (cv.ref && cv.ref.app_id.length >= 12) {]}
    <div>Remotely dependent to AppInstance {[=cv.ref.app_id]}</div> 
    {[}]}
  </div>

  <div class="card-body">
    <table class="incp-formtable">
      {[~cv.items :cvf]}
      <tr>
        <td width="300" class="lpt-title">{[=cvf.name]}</td>
        <td>{[=cvf.value]}</td>
      </tr>
      {[~]}
    </table>
  </div>
</div>
{[}]}

{[if (cv.subs && cv.subs.length > 0) {]}
<div class="card">

  <div class="card-header">
    <strong>Dependent by remote applications</strong>
  </div>

  <div class="card-body">
    {[=cv.subs.join(", ")]}
  </div>
</div>
{[}]}


{[~]}
</div>
