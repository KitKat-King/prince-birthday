export function drawLily(ctx, x, y, size) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 40, size / 40);
  ctx.fillStyle = "#cbb7ff";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 12, Math.PI / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
