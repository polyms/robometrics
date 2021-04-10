FROM python:3.9.2-slim-buster

# Set the working directory environment variable
ENV ROBOT_WORK_DIR /home/robot/app

# Set the reports directory environment variable
ENV ROBOT_REPORTS_DIR /home/robot/reports

# Add PYTHON PATH environment variable
ENV PYTHONPATH="$PYTHONPATH:$ROBOT_WORK_DIR"
ENV PYTHONWARNINGS="ignore:Unverified HTTPS request"
ENV ZSH_THEME af-magic

RUN apt update \
    && apt install -y --no-install-recommends zsh curl git openssh-server \
    && rm -rf /var/lib/apt/lists/* \
    && apt autoclean \
    && groupadd --gid 1000 robot \
    && useradd --uid 1000 --gid robot --shell /bin/zsh --create-home robot

USER robot

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/polyms/devcontainers/main/.zshrc -o /home/robot/.zshrc)" \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && mkdir -p ${ROBOT_WORK_DIR} \
    && mkdir -p ${ROBOT_REPORTS_DIR} \
    && export ROBOT_OPTIONS="--outputdir ${ROBOT_REPORTS_DIR}" \
    && echo 'export PATH=$PATH:/home/robot/.local/bin' >> ~/.zshrc

WORKDIR ${ROBOT_WORK_DIR}
VOLUME ${ROBOT_REPORTS_DIR}

RUN pip install --upgrade \
    pipenv \
    robotframework \
    robotframework-seleniumlibrary \
    robotframework-seleniumscreenshots \
    robotframework-requests

COPY --chown=robot:robot ./public/index.html ./public/robot.min.js ${ROBOT_WORK_DIR}/robot/

CMD ["robot", "--outputdir", "reports", "tests"]
